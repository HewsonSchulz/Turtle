from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import CustardBase


class CustardBases(ViewSet):
    def list(self, request):
        try:
            base_objs = CustardBase.objects.all().order_by('base')
            bases = [base.base for base in base_objs]
            return Response(bases)

        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        try:
            base = CustardBase.objects.get(pk=pk)
            return Response(
                CustardBaseSerializer(
                    base, many=False, context={'request': request}
                ).data
            )
        except CustardBase.DoesNotExist as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_404_NOT_FOUND)
        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustardBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustardBase
        fields = ['id', 'base']
