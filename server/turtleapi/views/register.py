'''Register user'''

import json
from django.http import HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token


@csrf_exempt
def register_user(request):
    '''user creation'''

    if request.method == 'POST':

        req_body = json.loads(request.body)

        if User.objects.filter(username=req_body['username']).exists():
            # username is taken
            return JsonResponse(
                {'valid': False, 'message': 'That username is taken'},
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

    body = request.body.decode('utf-8')
    req_body = json.loads(body)

    if request.method == 'POST':

        name = req_body['username']
        pwd = req_body['password']
        auth_user = authenticate(username=name, password=pwd)

        if auth_user:
            # user exists
            auth_user.last_login = timezone.now()
            auth_user.save()

            token = Token.objects.get(user=auth_user)
            return JsonResponse({'valid': True, 'token': token.key, 'id': auth_user.id})
        else:
            # user does not exist
            return JsonResponse({'valid': False}, status=status.HTTP_400_BAD_REQUEST)

    return HttpResponseNotAllowed(['POST'])
