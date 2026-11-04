from django.urls import path
from .views import music_home, TrackListView, audius_search


urlpatterns = [
    path('',music_home, name='music-home'),
    path('tracks/', TrackListView.as_view(), name='track-list'),
    path('audius/search/', audius_search, name='audius-search')
]