from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction
from .serializers import TransactionCreateSerializer
# Import the MultipleObjectsReturned exception
from django.core.exceptions import MultipleObjectsReturned


class TransactionCreateAPIView(APIView):
    def post(self, request):
        serializer = TransactionCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionRetrieveAPIView(APIView):
    def get(self, request, handling_unit):
        try:
            transaction = Transaction.objects.get(HandlingUnit=handling_unit)
            serializer = TransactionCreateSerializer(transaction)
            return Response(serializer.data)
        except Transaction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class TransactionRetrieveAPIView(APIView):
    def get(self, request, handling_unit):
        try:
            # Attempt to retrieve a single Transaction object based on HandlingUnit
            transaction = Transaction.objects.get(HandlingUnit=handling_unit)
            serializer = TransactionCreateSerializer(transaction)
            return Response(serializer.data)
        except Transaction.DoesNotExist:
            # Return a 404 response if no matching Transaction is found
            return Response(status=status.HTTP_404_NOT_FOUND)
        except MultipleObjectsReturned:
            # Handle the case where multiple objects are returned
            # Log an error or return an appropriate response
            return Response({"error": "Multiple Transactions found for HandlingUnit"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
