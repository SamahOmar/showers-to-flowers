from django.test import TestCase
from django.urls import reverse
from .models import GameSession


# ==========================================================================
# 🌿 CORE APPLICATION CONTRACT & REGRESSION TESTS (Original)
# ==========================================================================

class ShowersToFlowersCoreTests(TestCase):

    def setUp(self):
        """Initialize route parameters for integration testing."""
        self.game_url = reverse('game_view') if hasattr(reverse, 'game_view') else '/'

    def test_main_page_rendering_and_contract(self):
        """Verify the game view triggers a success state and returns template context."""
        response = self.client.get(self.game_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'game/game.html')

    def test_required_dom_elements_exist(self):
        """Ensure core UI elements required by modular JS are safely present in DOM."""
        response = self.client.get(self.game_url)
        html = response.content.decode('utf-8')
        self.assertIn('id="gameCanvas"', html)
        self.assertIn('id="growthBar"', html)


# ==========================================================================
# 🌸 NEW: HIGH-SHINE AESTHETIC REGRESSION TESTS
# ==========================================================================

class ShowersToFlowersAestheticTests(TestCase):

    def setUp(self):
        """Set up initial testing environment and paths."""
        self.game_url = reverse('game_view') if hasattr(reverse, 'game_view') else '/'

    def test_game_session_model_glamour_fields(self):
        """Verify that GameSession model stores the new luxury soft life tracking metrics."""
        session = GameSession.objects.create(
            session_key="test_glam_session_123",
            current_growth=40,
            glam_points=50,
            is_soft_life_achieved=True
        )
        self.assertEqual(session.glam_points, 50)
        self.assertTrue(session.is_soft_life_achieved)
        self.assertIn("Glam: 50", str(session))

    def test_view_injects_mindful_affirmations_and_glam(self):
        """Ensure the controller injects daily affirmations and glamour variables into context."""
        response = self.client.get(self.game_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('daily_affirmation', response.context)
        self.assertIn('glam_points', response.context)

    def test_template_renders_high_shine_dom_elements(self):
        """Validate that HTML templates display the luxury banner and accessible metrics."""
        response = self.client.get(self.game_url)
        html_content = response.content.decode('utf-8')

        # Verify the inclusion of our positive soft life validation engine
        self.assertIn('class="affirmation-banner"', html_content)
        self.assertIn('class="glam-counter"', html_content)
        self.assertIn('id="glam-points-value"', html_content)

        # Verify that the inclusive progress bar layout remains mathematically sound
        self.assertIn('class="custom-progress-bar"', html_content)
        self.assertIn('role="progressbar"', html_content)
