from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def health_check(request):
    """Simple health check for the account app."""
    return JsonResponse({"status": "ok", "app": "account"})


@require_http_methods(["GET"])
def info(request):
    return JsonResponse({"message": "Account endpoints are available."})
from django.shortcuts import render

# Create your views here.
