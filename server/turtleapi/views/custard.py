import json
from json.decoder import JSONDecodeError
from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import Custard, CustardBase, Topping
from .view_utils import calc_missing_props


class CustardFlavors(ViewSet):
    def list(self, request):
        try:
            custards = Custard.objects.all()
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
            return Response({'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        try:
            req_body = json.loads(request.body)
        except JSONDecodeError:
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
            return Response({'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST)

        # create custard flavor
        new_custard = Custard.objects.create(
            flavor=req_body.get('flavor').strip(),
            image_path=req_body.get('image_path'),
            base=base,
        )

        # add toppings
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
        except JSONDecodeError:
            return Response(
                {'message': 'Your request contains invalid json'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            custard = Custard.objects.get(pk=pk)
        except Custard.DoesNotExist:
            return Response(
                {'valid': False, 'message': 'That custard flavor does not exist'},
                status=status.HTTP_404_NOT_FOUND,
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

        # update image
        # TODO: implement support for uploading images
        if req_body.get('image_path'):
            custard.image_path = req_body.get('image_path')

        custard.save()

        # update toppings
        if req_body.get('toppings') or isinstance(req_body.get('toppings'), list):
            custard.toppings.clear()
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


class CustardSerializer(serializers.ModelSerializer):
    base = serializers.CharField(source='base.base')
    toppings = serializers.SerializerMethodField()

    class Meta:
        model = Custard
        fields = [
            'id',
            'flavor',
            'base',
            'toppings',
            'image_path',
        ]

    def get_toppings(self, custard):
        return [topping.topping for topping in custard.toppings.all()]
