from django.db import models


class GameSession(models.Model):
    """Records a completed game session (plant reached flower stage)."""

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    final_growth = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"Session {self.pk} — growth {self.final_growth}%"
