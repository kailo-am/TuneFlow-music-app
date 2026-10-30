
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics,filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Track
from .serializers import TrackSerializer


@api_view(['GET'])
def music_home(request):
   return Response({
      'app' : 'TuneFlow',
      'message' : 'Welcome to the TuneFlow API',
      'status' : 'running',
   })

class TrackListView(generics.ListAPIView):
   # queryset defines the set of data that will be returned by this view. In this case, it retrieves all Track objects from the database.
   queryset = Track.objects.all() 
   serializer_class = TrackSerializer

   # Add filtering, searching, and ordering capabilities
   filter_backends = [
      DjangoFilterBackend,
      filters.SearchFilter,
      filters.OrderingFilter,
   ]
   # Define the fields that can be filtered, searched, and ordered
   filterset_fields = ['title', 'artist', 'album', 'genre']
   search_fields = ['title', 'artist', 'album', 'genre']
   ordering_fields = ['title', 'artist', 'album', 'genre']
   ordering = ['title']  # Default ordering