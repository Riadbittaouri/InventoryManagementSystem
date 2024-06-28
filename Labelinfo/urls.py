from django.urls import path
from .views import LabelinfoListCreate, LabelinfoDetailView, LabelinfoList, LabelinfoFilterView, LabelinfoUpdatePosition

urlpatterns = [
    path('create-labelinfo/', LabelinfoListCreate.as_view(),
         name='labelinfo-list-create'),
    path('get-labelinfo/<str:handling_unit>/',
         LabelinfoFilterView.as_view(), name='labelinfo-filter'),
    path('get-labelinfo/<str:handling_unit>/<str:storage_bin>/',
         LabelinfoFilterView.as_view(), name='labelinfo-filter-with-bin'),
    path('delete-labelinfo/<str:handling_unit>/',
         LabelinfoDetailView.as_view(), name='labelinfo-delete'),
    path('get-all-labelinfo/', LabelinfoList.as_view(), name='labelinfo-list'),
    path('edit-position/<str:handling_unit>/',
         LabelinfoUpdatePosition.as_view(), name='labelinfo-edit-position'),
]
