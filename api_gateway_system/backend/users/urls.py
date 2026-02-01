from django.urls import path
from .views import RegisterView, ProtectedDataView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('protected/', ProtectedDataView.as_view(), name='protected'),
]
