from rest_framework import serializers
from .models import Transaction
from django.utils import timezone


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('HandlingUnit', 'Matricule', 'storage_location',
                  'storage_bin', 'material_number', 'Quantity', 'message', 'location_type')

    def create(self, validated_data):
        # Get the current date and time
        current_datetime = timezone.now()

        # Set the current date and time to the validated data
        validated_data['date_transaction'] = current_datetime.date()
        validated_data['hour_transaction'] = current_datetime.time()

        # Check if the message is "Added manually"
        if validated_data.get('message') == "Added manually":
            # Update the message to "Scanned"
            validated_data['message'] = "Scanned"

        # Call the superclass create method to create the transaction
        return super().create(validated_data)

    def to_representation(self, instance):
        # This method transforms the Transaction model instance into Python primitive types.
        representation = super(TransactionCreateSerializer,
                               self).to_representation(instance)

        # Ensure 'Quantity' is a string before calling replace (if necessary).
        if 'Quantity' in representation:
            quantity = representation['Quantity']
            # If you need to manipulate the quantity as a string, you can convert it here.
            # For example, if you want to remove decimal places:
            representation['Quantity'] = str(quantity).replace(
                '.0', '') if isinstance(quantity, float) else quantity

        # Include any additional logic you need here

        return representation
