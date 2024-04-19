from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from turtleapi.views import register_user, login_user
from turtleapi.views import Employees, CustardFlavors

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'employees', Employees, 'employee')
router.register(r'users', Employees, 'user')
router.register(r'custards', CustardFlavors, 'custard')

urlpatterns = [
    path('', include(router.urls)),
    path('register', register_user),
    path('login', login_user),
]
