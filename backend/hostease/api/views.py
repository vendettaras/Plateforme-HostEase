from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView

from rest_framework_simplejwt.views import TokenObtainPairView

import logging


from rest_framework import generics
from rest_framework.permissions import IsAdminUser, AllowAny
from hostease.models import Entreprise, Offre
from .serializers import EntrepriseSerializer, OffreSerializer, MyTokenObtainPairSerializer

    
class MyTokenObtainPairView(TokenObtainPairView) :
    serializer_class = MyTokenObtainPairSerializer

class EntrepriseCreateView(generics.CreateAPIView):
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseSerializer

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


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token', 
        '/api/token/refresh/',
    ]

    return Response(routes)