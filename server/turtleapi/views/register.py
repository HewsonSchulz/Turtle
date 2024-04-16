'''Register user'''

import json
from django.http import HttpResponse, HttpResponseNotAllowed
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token


@csrf_exempt
def register_user(request):
    '''user creation'''

    req_body = json.loads(request.body.decode())

    new_user = User.objects.create_user(
        username=req_body['username'],
        email=req_body['email'],
        password=req_body['password'],
        first_name=req_body['first_name'],
        last_name=req_body['last_name'],
    )

    token = Token.objects.create(user=new_user)

    # Return the token to the client
    data = json.dumps({'token': token.key, 'id': new_user.id})
    return HttpResponse(
        data, content_type='application/json', status=status.HTTP_201_CREATED
    )


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
            auth_user.last_login = timezone.now()
            auth_user.save()

            token = Token.objects.get(user=auth_user)
            data = json.dumps({'valid': True, 'token': token.key, 'id': auth_user.id})
            return HttpResponse(data, content_type='application/json')
        else:
            data = json.dumps({'valid': False})
            return HttpResponse(data, content_type='application/json')

    return HttpResponseNotAllowed(permitted_methods=['POST'])
