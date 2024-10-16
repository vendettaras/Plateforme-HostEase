from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView, DestroyAPIView
from django.utils import timezone

from rest_framework_simplejwt.tokens import RefreshToken

from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView


import logging


from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from .serializers import (
    InfoEntrepriseSerializer, 
    OffreSerializer, 
    CustomTokenObtainPairSerializer,
    CustomUserSerializer,
    )


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, ValidationError
from hostease.models import CustomUser, InfoEntreprise, Offre  # Assurez-vous que cela correspond à votre modèle
from rest_framework_simplejwt.views import TokenRefreshView
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

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


# views.py

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