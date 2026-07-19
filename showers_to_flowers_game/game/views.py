import random
from django.shortcuts import render
from .models import GameSession


def game_view(request):
    # Creating or merging the existing session
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key

    game_session, created = GameSession.objects.get_or_create(session_key=session_key)

    # list of Daily Affirmations
    daily_affirmations = [
        "Pour yourself an iced latte and let your inner flower bloom. 🌸✨",
        "High-shine, low-stress. You are doing amazing sweetie! 💅🏼💖",
        "Protect your peace, write your code, and chase the sunset. 🌅💻",
        "Slow down. Just like flowers, you need rain and time to grow. ✨🌷",
        "Manifesting error-free code and unlimited glitter-pink vibes today. 🎀"
    ]

    # randomly selected
    selected_affirmation = random.choice(daily_affirmations)

    context = {
        'game_session': game_session,
        'current_growth': game_session.current_growth,
        'glam_points': game_session.glam_points,
        'daily_affirmation': selected_affirmation,
    }

    return render(request, 'game/game.html', context)
