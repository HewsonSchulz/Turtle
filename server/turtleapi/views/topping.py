from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import Topping


class Toppings(ViewSet):
    def list(self, request):
        try:
            topping_objs = Topping.objects.all()
            toppings = [topping.topping for topping in topping_objs]
            return Response(toppings)

        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        try:
            topping = Topping.objects.get(pk=pk)
            return Response(
                ToppingSerializer(
                    topping, many=False, context={'request': request}
                ).data
            )
        except Topping.DoesNotExist as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ['id', 'topping']
