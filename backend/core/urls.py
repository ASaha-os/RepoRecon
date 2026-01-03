"""
URL configuration for core app
"""

from django.urls import path
from core.views import AnalyzeRepoView, HealthCheckView

app_name = 'core'

urlpatterns = [
    path('analyze/', AnalyzeRepoView.as_view(), name='analyze-repo'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
