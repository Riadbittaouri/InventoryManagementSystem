from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Labelinfo
from .serializers import LabelInfoSerializer


class LabelinfoListCreate(generics.ListCreateAPIView):
    queryset = Labelinfo.objects.all()
    serializer_class = LabelInfoSerializer

    def perform_create(self, serializer):
        quantity = self.request.data.get('Quantity', '')
        float_quantity = convert_comma_to_float(quantity)
        serializer.save(Quantity=float_quantity)


class LabelinfoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Labelinfo.objects.all()
    serializer_class = LabelInfoSerializer


class LabelinfoDetailView(APIView):
    def get(self, request, handling_unit, format=None):
        try:
            labelinfo = Labelinfo.objects.get(HandlingUnit=handling_unit)
            serializer = LabelInfoSerializer(labelinfo)
            return Response(serializer.data)
        except Labelinfo.DoesNotExist:
            return Response({"error": "Labelinfo not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, handling_unit, format=None):
        try:
            labelinfo = Labelinfo.objects.get(HandlingUnit=handling_unit)
            labelinfo.delete()
            return Response({"message": "Labelinfo deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Labelinfo.DoesNotExist:
            return Response({"error": "Labelinfo not found"}, status=status.HTTP_404_NOT_FOUND)


class LabelinfoList(generics.ListAPIView):
    queryset = Labelinfo.objects.all()
    serializer_class = LabelInfoSerializer


class LabelinfoFilterView(APIView):
    serializer_class = LabelInfoSerializer

    def get(self, request, handling_unit, storage_bin=None, format=None):
        try:
            if storage_bin:
                labelinfo = Labelinfo.objects.get(
                    HandlingUnit=handling_unit, Storage_Bin=storage_bin)
            else:
                labelinfo = Labelinfo.objects.get(HandlingUnit=handling_unit)
            serializer = LabelInfoSerializer(labelinfo)
            return Response(serializer.data)
        except Labelinfo.DoesNotExist:
            if storage_bin:
                return Response({"error": f"Labelinfo not found for handling unit '{handling_unit}' and storage bin '{storage_bin}'"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": f"Labelinfo not found for handling unit '{handling_unit}'"}, status=status.HTTP_404_NOT_FOUND)


def convert_comma_to_float(value):
    try:
        return float(value.replace(',', ''))
    except ValueError:
        return None


class LabelinfoUpdatePosition(APIView):
    def patch(self, request, handling_unit):
        labelinfo = get_object_or_404(Labelinfo, HandlingUnit=handling_unit)
        storage_bin = request.data.get('Storage_Bin')
        if storage_bin:
            labelinfo.Storage_Bin = storage_bin
            labelinfo.save()
            return Response({'message': 'Storage Bin updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Storage Bin not provided'}, status=status.HTTP_400_BAD_REQUEST)
