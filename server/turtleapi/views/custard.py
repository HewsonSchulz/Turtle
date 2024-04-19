from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import Custard, Topping


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


class CustardSerializer(serializers.ModelSerializer):
    base = serializers.CharField(source='base.base')
    toppings = serializers.SerializerMethodField()

    class Meta:
        model = Custard
        fields = [
            'flavor',
            'base',
            'toppings',
            'image_path',
        ]

    def get_toppings(self, custard):
        return [topping.topping for topping in custard.toppings.all()]
