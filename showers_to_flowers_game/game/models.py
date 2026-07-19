from django.db import models


class GameSession(models.Model):
    # Core Logic
    session_key = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    current_growth = models.IntegerField(default=0)

    # 🌟  (Glamour & Soft Life Tracking)
    glam_points = models.IntegerField(default=0, help_text="Points earned by romanticizing the game")
    is_soft_life_achieved = models.BooleanField(default=False,
                                                help_text="True when the player blooms without overwatering")

    def __str__(self):
        return f"Session {self.session_key} - Glam: {self.glam_points} - Soft Life: {self.is_soft_life_achieved}"

