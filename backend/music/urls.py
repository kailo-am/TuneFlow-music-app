from django.urls import path
from .views import music_home, TrackListView


urlpatterns = [
    path('',music_home, name='music-home'),
    path('tracks/', TrackListView.as_view(), name='track-list')
]