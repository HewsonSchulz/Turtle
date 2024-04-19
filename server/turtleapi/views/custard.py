import json
from json.decoder import JSONDecodeError
from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import Custard, CustardBase
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
                {
                    'message': 'Your request contains invalid json',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        missing_props_msg = calc_missing_props(req_body, ['flavor', 'base'])

        if missing_props_msg:
            return Response(
                {'valid': False, 'message': missing_props_msg},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Custard.objects.filter(flavor=req_body['flavor']).exists():
            # custard flavor already exists
            return Response(
                {'valid': False, 'message': 'That custard flavor already exists'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            base = CustardBase.objects.get(pk=req_body.get('base'))
        except CustardBase.DoesNotExist as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST)

        # create custard flavor
        new_custard = Custard.objects.create(
            flavor=req_body.get('flavor'),
            image_path=req_body.get('image_path'),
            base=base,
        )

        return Response(
            {
                'valid': True,
                **CustardSerializer(new_custard, context={'request': request}).data,
            },
            status=status.HTTP_201_CREATED,
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
