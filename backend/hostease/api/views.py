from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView, DestroyAPIView, RetrieveAPIView, ListAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated, BasePermission


from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin

import logging

from .serializers import (
    InfoEntrepriseSerializer, 
    OffreSerializer, 
    CustomTokenObtainPairSerializer,
    CustomUserSerializer,
    )
from hostease.models import (
    CustomUser, 
    InfoEntreprise, 
    Offre,
  )  

class IsOwner(BasePermission):
    """
    Permission qui ne permet aux utilisateurs de modifier que leurs propres objets.
    """

    def has_object_permission(self, request, view, obj):
        # Vérifie si l'utilisateur est le propriétaire de l'objet
        return obj.user == request.user
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    

# -----------------------------------------Inscription------------------------------------------


class InscriptionUserView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Enregistre l'utilisateur
            return Response({
                "id": user.id,  # Retourne l'ID de l'utilisateur pour la suite de l'inscription
                "message": "Utilisateur créé avec succès"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InscriptionEntrepriseView(APIView):
    
    def post(self, request):
        user_id = request.data.get('user_id')  # ID de l'utilisateur envoyé depuis React
        try:
            user = CustomUser.objects.get(id=user_id)
            if user.role != 'entreprise':
                return Response({"error": "Cet utilisateur n'est pas une entreprise"}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        # Associe l'utilisateur à l'entreprise dans InfoEntreprise
        request.data['user'] = user.id  # Associe l'utilisateur à l'entreprise
        serializer = InfoEntrepriseSerializer(data=request.data)
        if serializer.is_valid():
            entreprise = serializer.save()
            return Response({
                "message": "Entreprise créée avec succès",
                "entreprise_id": entreprise.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# -----------------------------------------CustomUser------------------------------------------

class ProfileView(RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_object(self):
        # Retourne l'utilisateur authentifié
        return self.request.user

class EntrepriseListForUser(ListAPIView):
    serializer_class = InfoEntrepriseSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            return InfoEntreprise.objects.filter(user__id=user_id)
        return InfoEntreprise.objects.none()  # Retourne une liste vide si aucun user_id n'est fourni

# -----------------------------------------Entreprise------------------------------------------


class InfoEntrepriseUpdateView(RetrieveUpdateAPIView):
    queryset = InfoEntreprise.objects.all()
    serializer_class = InfoEntrepriseSerializer
    permission_classes = [IsAuthenticated, IsOwner]  # Assurez-vous que les deux permissions sont là
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"User: {request.user}, trying to access InfoEntrepriseUpdateView")
        return super().get(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
    # Assigner automatiquement l'utilisateur connecté au champ 'user'
        request.data['user'] = request.user.id
        return super().update(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        # Gestion des fichiers uploadés
        serializer.save(user=self.request.user)
    
class EntrepriseDetailView(RetrieveAPIView):
    queryset = InfoEntreprise.objects.all()
    serializer_class = InfoEntrepriseSerializer
    permission_classes = [AllowAny]  # Optionnel si vous souhaitez restreindre l'accès
    lookup_field = 'pk'  # Pour utiliser l'ID de l'entreprise dans l'URL

    def get(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"User: {request.user}, accessing entreprise {kwargs['pk']} details")
        return super().get(request, *args, **kwargs)
    

class InfoEntrepriseList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        infoEntreprise = InfoEntreprise.objects.all()
        serializer = InfoEntrepriseSerializer(infoEntreprise, many=True)
        return Response(serializer.data)
    

# -----------------------------------------Offre------------------------------------------


class OffreList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        offres = Offre.objects.all()
        serializer = OffreSerializer(offres, many=True)
        return Response(serializer.data)


class OffreCreate(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        
        serializer = OffreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OffreUpdateView(RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Offre.objects.all()
    serializer_class = OffreSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"User: {request.user}, trying to access OffreUpdateView")
        return super().get(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"User: {request.user}, trying to update offre {kwargs['pk']}")
        return super().put(request, *args, **kwargs)

class OffreDetailView(RetrieveAPIView):
    queryset = Offre.objects.all()
    serializer_class = OffreSerializer
    permission_classes = [AllowAny]  # Optionnel si vous souhaitez restreindre l'accès
    lookup_field = 'pk'  # Pour utiliser l'ID de l'entreprise dans l'URL

    def get(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"User: {request.user}, accessing entreprise {kwargs['pk']} details")
        return super().get(request, *args, **kwargs)
    

class OffreDeleteView(DestroyAPIView):
    permission_classes = [IsAdminUser]  # Seuls les administrateurs peuvent supprimer
    queryset = Offre.objects.all()
    serializer_class = OffreSerializer
    lookup_field = 'pk'

    def delete(self, request, pk):
        try:
            offre = Offre.objects.get(pk=pk)
            offre.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Offre.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token', 
        '/api/token/refresh/',
    ]

    return Response(routes)