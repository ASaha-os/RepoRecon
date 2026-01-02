"""
URL configuration for RepoRecon backend
"""

from django.urls import path, include
from core.views import RootView

urlpatterns = [
    path('', RootView.as_view(), name='root'),
    path('api/', include('core.urls')),
]
