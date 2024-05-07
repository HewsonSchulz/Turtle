import json
from json.decoder import JSONDecodeError
from django.contrib.auth import get_user_model
from rest_framework import serializers, status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from turtleapi.models import Employee

User = get_user_model()


class Employees(ViewSet):

    def list(self, request):
        employee = Employee.objects.get(user=request.auth.user)

        if not employee.is_admin:
            # user has invalid permission
            return Response(
                {'message': '''You don't have permission to view this information'''},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            employees = Employee.objects.all()
            return Response(
                EmployeeSerializer(
                    employees, many=True, context={'request': request}
                ).data
            )
        except Exception as ex:
            return Response(
                {'message': ex.args[0]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def retrieve(self, request, pk=None):
        try:
            req_employee = Employee.objects.get(user=request.auth.user)
            employee = Employee.objects.get(pk=pk)

            if not (req_employee.is_admin or req_employee.id == employee.id):
                # user has invalid permission
                return Response(
                    {
                        'message': '''You don't have permission to view this information'''
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            return Response(
                EmployeeSerializer(
                    employee, many=False, context={'request': request}
                ).data
            )
        except Employee.DoesNotExist as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_404_NOT_FOUND)
        except Exception as ex:
            return Response(
                {'message': ex.args[0]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, pk=None):
        try:
            req_employee = Employee.objects.get(user=request.auth.user)
            user = User.objects.get(pk=pk)
            employee = Employee.objects.get(user=user)

        except (User.DoesNotExist, Employee.DoesNotExist) as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_404_NOT_FOUND)

        if 'admin' in request.GET:
            if not (req_employee.is_admin):
                # user has invalid permission
                return Response(
                    {
                        'valid': False,
                        'message': '''You don't have permission to do that''',
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # update admin status
            employee.is_admin = not employee.is_admin
            employee.save()

            return Response(
                {
                    'valid': True,
                    **AdminSerializer(employee, context={'request': request}).data,
                }
            )

        try:
            req_body = json.loads(request.body)
        except JSONDecodeError:
            return Response(
                {'message': 'Your request contains invalid json'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not (req_employee.is_admin or req_employee.id == user.id):
            # user has invalid permission
            return Response(
                {'valid': False, 'message': '''You don't have permission to do that'''},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # update employee
        if req_body.get('first_name') is not None:
            user.first_name = req_body.get('first_name', '').strip()
        if req_body.get('last_name') is not None:
            user.last_name = req_body.get('last_name', '').strip()
        user.save()

        return Response(
            {
                'valid': True,
                **EmployeeSerializer(employee, context={'request': request}).data,
            }
        )


class EmployeeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    full_name = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(source='user.date_joined')
    last_login = serializers.DateTimeField(source='user.last_login')
    rank = serializers.CharField(source='rank.rank', allow_null=True, required=False)
    fav_position = serializers.CharField(
        source='fav_position.position', allow_null=True, required=False
    )
    fav_custard = serializers.CharField(
        source='fav_custard.flavor', allow_null=True, required=False
    )
    fav_food = serializers.CharField(
        source='fav_food.item', allow_null=True, required=False
    )

    class Meta:
        model = Employee
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'full_name',
            'date_joined',
            'last_login',
            'is_admin',
            'is_guest',
            'date_employed',
            'date_unemployed',
            'rank',
            'fav_position',
            'fav_custard',
            'fav_food',
        ]

    def get_full_name(self, employee):
        if employee.user.first_name or employee.user.last_name:
            return f'{employee.user.first_name} {employee.user.last_name}'

        return employee.user.username

    def to_representation(self, instance):
        '''if given user is a guest, exclude certain fields'''
        representation = super().to_representation(instance)
        excluded_fields = [
            'date_employed',
            'date_unemployed',
            'rank',
            'fav_position',
            'fav_custard',
            'fav_food',
        ]
        if instance.is_guest:
            for field in excluded_fields:
                representation.pop(field)
        return representation


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'is_admin']
