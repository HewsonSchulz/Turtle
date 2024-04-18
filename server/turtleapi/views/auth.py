import json
from json.decoder import JSONDecodeError
from django.http import HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from .view_utils import calc_missing_props


@csrf_exempt
def register_user(request):
    '''user creation'''

    if request.method == 'POST':

        try:
            req_body = json.loads(request.body)
        except JSONDecodeError:
            return JsonResponse(
                {
                    'message': 'Your request contains invalid json',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        missing_props_msg = calc_missing_props(
            req_body, ['username', 'email', 'password', 'first_name', 'last_name']
        )
        if missing_props_msg:
            return JsonResponse(
                {'valid': False, 'message': missing_props_msg},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=req_body['username']).exists():
            # username is taken
            return JsonResponse(
                {'valid': False, 'message': 'That username is already in use'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # create new user
        new_user = User.objects.create_user(
            username=req_body['username'],
            email=req_body['email'],
            password=req_body['password'],
            first_name=req_body['first_name'],
            last_name=req_body['last_name'],
        )

        # create new token
        token = Token.objects.create(user=new_user)

        return JsonResponse(
            {'valid': True, 'token': token.key, 'id': new_user.id},
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
            {
                'message': 'Your request contains invalid json',
            },
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
            username=req_body['username'], password=req_body['password']
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
