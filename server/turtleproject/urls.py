from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from turtleapi.views import register_user, login_user
from turtleapi.views import Employees, CustardFlavors, Toppings, CustardBases, NewEmails

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'employees', Employees, 'employee')
router.register(r'users', Employees, 'user')
router.register(r'custards', CustardFlavors, 'custard')
router.register(r'toppings', Toppings, 'topping')
router.register(r'bases', CustardBases, 'base')
router.register(r'emails', NewEmails, 'email')

urlpatterns = [
    path('', include(router.urls)),
    path('register', register_user),
    path('login', login_user),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
