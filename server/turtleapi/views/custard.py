import json
from json.decoder import JSONDecodeError
from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import Custard, CustardBase, Topping, Employee
from .view_utils import calc_missing_props


class CustardFlavors(ViewSet):
    def list(self, request):
        try:
            custards = Custard.objects.all().order_by('flavor')
            return Response(
                CustardSerializer(
                    custards, many=True, context={'request': request}
                ).data
            )
        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        try:
            custard = Custard.objects.get(pk=pk)
            return Response(
                CustardSerializer(
                    custard, many=False, context={'request': request}
                ).data
            )
        except Custard.DoesNotExist as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_404_NOT_FOUND)
        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        try:
            req_body = json.loads(request.body)
        except (JSONDecodeError, UnicodeDecodeError):
            if request.POST:

                # if request is using form-data
                req_body = request.POST
                toppings = req_body.getlist('toppings[]', None)
            else:
                return Response(
                    {'message': 'Your request contains invalid json'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        missing_props_msg = calc_missing_props(req_body, ['flavor', 'base'])

        if missing_props_msg:
            return Response(
                {'valid': False, 'message': missing_props_msg},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Custard.objects.filter(flavor=req_body.get('flavor').strip()).exists():
            # custard flavor already exists
            return Response(
                {'valid': False, 'message': 'That custard flavor already exists'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            try:
                # base id was provided
                base = CustardBase.objects.get(pk=req_body.get('base'))
            except ValueError:
                # base name was provided
                base = CustardBase.objects.get(base=req_body.get('base'))

        except CustardBase.DoesNotExist as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_404_NOT_FOUND)

        # create custard flavor
        new_custard = Custard.objects.create(
            creator_id=request.auth.user.id,
            flavor=req_body.get('flavor').strip(),
            base=base,
        )

        # add image
        if request.FILES.get('image'):
            new_custard.image = request.FILES['image']
            new_custard.save()

        # add toppings
        if not toppings:
            toppings = req_body.get('toppings', [])
        if len(toppings) > 0:
            toppings = sorted(toppings, key=lambda x: x.lower())
            for new_topping in toppings:
                try:
                    try:
                        # topping id was provided
                        topping = Topping.objects.get(pk=new_topping)
                    except ValueError:
                        # topping name was provided
                        topping = Topping.objects.get(topping=new_topping)

                    new_custard.toppings.add(topping)
                except Topping.DoesNotExist:
                    # ignore toppings that do not exist
                    pass  #!

        return Response(
            {
                'valid': True,
                **CustardSerializer(new_custard, context={'request': request}).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, pk=None):
        try:
            req_body = json.loads(request.body)
        except (JSONDecodeError, UnicodeDecodeError):
            if request.POST:
                # if request is using form-data
                req_body = request.POST
                toppings = req_body.getlist('toppings[]', None)
            else:
                return Response(
                    {'message': 'Your request contains invalid json'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            custard = Custard.objects.get(pk=pk)
            employee = Employee.objects.get(user=request.auth.user)
        except Custard.DoesNotExist:
            return Response(
                {'valid': False, 'message': 'That custard flavor does not exist'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if (employee.id != custard.creator_id) and (not employee.is_admin):
            # user has invalid permission
            return Response(
                {'valid': False, 'message': '''You don't have permission to do that'''},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # update flavor
        if req_body.get('flavor'):
            if (
                Custard.objects.filter(flavor=req_body.get('flavor').strip())
                .exclude(pk=custard.pk)
                .exists()
            ):
                # custard flavor already exists
                return Response(
                    {'valid': False, 'message': 'That custard flavor already exists'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                custard.flavor = req_body.get('flavor').strip()

        # update base
        try:
            try:
                # base id was provided
                base = CustardBase.objects.get(pk=req_body.get('base'))
            except ValueError:
                # base name was provided
                base = CustardBase.objects.get(base=req_body.get('base'))

            custard.base = base

        except CustardBase.DoesNotExist:
            # base was not provided
            pass  #!

        # handle image upload
        if request.FILES.get('image'):
            custard.image = request.FILES['image']

        custard.save()

        # update toppings
        toppings = None
        if request.POST:
            # if request is using form-data
            toppings = request.POST.getlist('toppings[]', [])
        else:
            if req_body.get('toppings') or isinstance(req_body.get('toppings'), list):
                toppings = req_body.get('toppings')

        if toppings or isinstance(toppings, list):
            custard.toppings.clear()
            if len(toppings) > 0:
                toppings = sorted(toppings, key=lambda x: x.lower())
                for new_topping in toppings:
                    try:
                        try:
                            # topping id was provided
                            topping = Topping.objects.get(pk=new_topping)
                        except ValueError:
                            # topping name was provided
                            topping = Topping.objects.get(topping=new_topping)

                        custard.toppings.add(topping)
                    except Topping.DoesNotExist:
                        # ignore toppings that do not exist
                        pass  #!

        return Response(
            {
                'valid': True,
                **CustardSerializer(custard, context={'request': request}).data,
            }
        )

    def destroy(self, request, pk=None):
        try:
            custard = Custard.objects.get(pk=pk)
            employee = Employee.objects.get(user=request.auth.user)
        except Custard.DoesNotExist:
            return Response(
                {'message': 'That custard flavor does not exist'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if (employee.id != custard.creator_id) and (not employee.is_admin):
            # user has invalid permission
            return Response(
                {'valid': False, 'message': '''You don't have permission to do that'''},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        custard.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class CustardSerializer(serializers.ModelSerializer):
    base = serializers.CharField(source='base.base')
    toppings = serializers.SerializerMethodField()

    class Meta:
        model = Custard
        fields = [
            'id',
            'creator_id',
            'created',
            'flavor',
            'base',
            'toppings',
            'image',
            'is_default',
        ]

    def get_toppings(self, custard):
        return [topping.topping for topping in custard.toppings.all()]
