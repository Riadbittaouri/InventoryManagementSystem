# urls.py
from django.urls import path
from .views import TransactionCreateAPIView, TransactionRetrieveAPIView

urlpatterns = [
    path('create/', TransactionCreateAPIView.as_view(), name='create_transaction'),
    path('get-transaction/<str:handling_unit>/', TransactionRetrieveAPIView.as_view(), name='get_transaction'),
]
