from django.urls import include, path
from rest_framework import routers
from turtleapi.views import register_user, login_user
from turtleapi.views import Employees, CustardFlavors, Toppings, CustardBases

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'employees', Employees, 'employee')
router.register(r'users', Employees, 'user')
router.register(r'custards', CustardFlavors, 'custard')
router.register(r'toppings', Toppings, 'topping')
router.register(r'bases', CustardBases, 'base')

urlpatterns = [
    path('', include(router.urls)),
    path('register', register_user),
    path('login', login_user),
]
