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
    InfoEntrepriseUpdateView,
    InfoEntrepriseList,
    EntrepriseDetailView,
    )

urlpatterns = [
    path('', getRoutes),

    # TOKEN ,

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

    # INSCRIPTION ,

    path('register-user/', InscriptionUserView.as_view(), name='register_user'),
    path('register-entreprise/', InscriptionEntrepriseView.as_view(), name='register_entreprise'),

    # ENTREPRISES ,

    path('entreprise/<int:pk>/', EntrepriseDetailView.as_view(), name='entreprise-detail'),
    path('entreprise/<int:pk>/modifier/', InfoEntrepriseUpdateView.as_view(), name='entreprise-modifier'),
    path('entreprises/', InfoEntrepriseList.as_view(), name='entreprise-list'),

    # OFFRES ,

    path('offres/', OffreList.as_view(), name='offre-list'),
    path('offre/create/', OffreCreate.as_view(), name='offre-create'),
    path('offre/<int:pk>/', OffreUpdateView.as_view(), name='offre-update'),
    path('offre/<int:pk>/delete/', OffreDeleteView.as_view(), name='offre-delete'),

]
