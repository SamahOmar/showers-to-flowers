from django.contrib import admin
from .models import GameSession

@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    # 🎀 Display our luxury dashboard metrics inside the Django Admin panel
    list_display = ('session_key', 'created_at', 'current_growth', 'glam_points', 'is_soft_life_achieved')
    readonly_fields = ('created_at',)
    search_fields = ('session_key',)
    list_filter = ('is_soft_life_achieved', 'created_at')

