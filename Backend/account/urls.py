from django.urls import path
from django.http import HttpResponse

def dummy_view(request):
    return HttpResponse("Account app is active!")

urlpatterns = [
    path('test/', dummy_view),
]