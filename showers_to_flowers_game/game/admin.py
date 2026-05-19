from django.contrib import admin
from .models import GameSession


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ("pk", "started_at", "completed_at", "final_growth")
    readonly_fields = ("started_at",)

