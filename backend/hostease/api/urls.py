from django.urls import path
from .views import (
    getRoutes, 
    OffreList, 
    OffreCreate, 
    OffreUpdateView,
    OffreDeleteView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    InscriptionEntrepriseView,
    InscriptionUserView,
    )

urlpatterns = [
    path('', getRoutes),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register-user/', InscriptionUserView.as_view(), name='register_user'),
    path('register-entreprise/', InscriptionEntrepriseView.as_view(), name='register_entreprise'),
    path('offres/', OffreList.as_view(), name='offre-list'),
    path('offre/create/', OffreCreate.as_view(), name='offre-create'),
    path('offre/<int:pk>/', OffreUpdateView.as_view(), name='offre-update'),
    path('offre/<int:pk>/delete/', OffreDeleteView.as_view(), name='offre-delete'),

]
