import json
from json.decoder import JSONDecodeError
from django.http import HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from turtleapi.models import Employee, Rank, Position, Custard, MenuItem
from .view_utils import calc_missing_props


@csrf_exempt
def register_user(request):
    '''user creation'''

    if request.method == 'POST':
        try:
            req_body = json.loads(request.body)
        except JSONDecodeError:
            return JsonResponse(
                {'message': 'Your request contains invalid json'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_guest = request.GET.get('guest', '').lower() == 'true'

        if is_guest:
            missing_props_msg = calc_missing_props(
                req_body,
                ['username', 'password'],
            )
        else:
            missing_props_msg = calc_missing_props(
                req_body,
                [
                    'username',
                    'password',
                    'first_name',
                    'last_name',
                    'date_employed',
                    'rank',
                    'fav_position',
                    'fav_custard',
                    'fav_food',
                ],
            )

        if missing_props_msg:
            return JsonResponse(
                {'valid': False, 'message': missing_props_msg},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=req_body.get('username')).exists():
            # username is taken
            return JsonResponse(
                {'valid': False, 'message': 'That username is already in use'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not is_guest:
            # non-guest registration
            try:
                rank = Rank.objects.get(pk=req_body.get('rank'))
                fav_position = Position.objects.get(pk=req_body.get('fav_position'))
                fav_custard = Custard.objects.get(pk=req_body.get('fav_custard'))
                fav_food = MenuItem.objects.get(pk=req_body.get('fav_food'))
            except Rank.DoesNotExist as ex:
                return JsonResponse(
                    {'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST
                )
            except Position.DoesNotExist as ex:
                return JsonResponse(
                    {'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST
                )
            except Custard.DoesNotExist as ex:
                return JsonResponse(
                    {'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST
                )
            except MenuItem.DoesNotExist as ex:
                return JsonResponse(
                    {'message': ex.args[0]}, status=status.HTTP_400_BAD_REQUEST
                )

            # create new user
            new_user = User.objects.create_user(
                username=req_body.get('username'),
                email=req_body.get('email', ''),
                password=req_body.get('password'),
                first_name=req_body.get('first_name'),
                last_name=req_body.get('last_name'),
            )

            # create new token
            token = Token.objects.create(user=new_user)

            # create new employee
            new_employee = Employee.objects.create(
                user=new_user,
                is_admin=False,
                is_guest=False,
                date_employed=req_body.get('date_employed'),
                date_unemployed=req_body.get('date_unemployed'),
                rank=rank,
                fav_position=fav_position,
                fav_custard=fav_custard,
                fav_food=fav_food,
            )

        else:
            # guest registration

            # create new user
            new_user = User.objects.create_user(
                username=req_body.get('username'), password=req_body.get('password')
            )

            # create new token
            token = Token.objects.create(user=new_user)

            # create new employee
            new_employee = Employee.objects.create(
                user=new_user, is_admin=False, is_guest=True
            )

        return JsonResponse(
            {'valid': True, 'token': token.key, 'id': new_employee.id},
            status=status.HTTP_201_CREATED,
        )

    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
def login_user(request):
    '''user authentication'''

    try:
        req_body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse(
            {'message': 'Your request contains invalid json'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if request.method == 'POST':

        missing_props_msg = calc_missing_props(req_body, ['username', 'password'])
        if missing_props_msg:
            return JsonResponse(
                {
                    'valid': False,
                    'message': missing_props_msg,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        auth_user = authenticate(
            username=req_body.get('username'), password=req_body.get('password')
        )

        if auth_user:
            # user exists
            auth_user.last_login = timezone.now()
            auth_user.save()

            token = Token.objects.get(user=auth_user)
            return JsonResponse({'valid': True, 'token': token.key, 'id': auth_user.id})
        else:
            # user does not exist
            return JsonResponse(
                {'valid': False, 'message': 'Invalid username or password'},
                status=status.HTTP_400_BAD_REQUEST,
            )

    return HttpResponseNotAllowed(['POST'])
