from django.contrib import admin
from .models import Track


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'genre', 'duration', 'created_at')
    search_fields = ('title', 'artist', 'album', 'genre')
    list_filter = ('genre', 'created_at')

