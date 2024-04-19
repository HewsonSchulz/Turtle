from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import Employee
from django.contrib.auth.models import User


class Employees(ViewSet):

    def list(self, request):
        try:
            employees = Employee.objects.all()
            return Response(
                EmployeeSerializer(
                    employees, many=True, context={'request': request}
                ).data
            )
        except Exception as ex:
            return Response(
                {'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EmployeeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    date_joined = serializers.DateTimeField(source='user.date_joined')
    last_login = serializers.DateTimeField(source='user.last_login')
    rank = serializers.CharField(source='rank.rank')
    fav_position = serializers.CharField(source='fav_position.position')
    fav_custard = serializers.CharField(source='fav_custard.flavor')
    fav_food = serializers.CharField(source='fav_food.item')

    class Meta:
        model = Employee
        fields = [
            'username',
            'first_name',
            'last_name',
            'date_joined',
            'last_login',
            'date_employed',
            'date_unemployed',
            'rank',
            'fav_position',
            'fav_custard',
            'fav_food',
        ]
