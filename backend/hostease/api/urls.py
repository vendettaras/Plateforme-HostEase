from django.urls import path
from .views import EntrepriseCreateView, getRoutes, MyTokenObtainPairView, OffreList, OffreCreate

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', getRoutes),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('entreprises/', EntrepriseCreateView.as_view(), name='entreprise-create'),
    path('offres/', OffreList.as_view(), name='offre-list'),
    path('offre/create/', OffreCreate.as_view(), name='offre-create'),

]
