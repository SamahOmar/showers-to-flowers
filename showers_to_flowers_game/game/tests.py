from django.test import TestCase
from django.urls import reverse
from django.contrib.staticfiles import finders

from game.models import GameSession


# ────────────────────────────────────────────
# Characterization tests (public API boundary)
# safety nets for code you don’t fully understand yet.
# They don’t test “correct behavior” per se—they just capture how the code currently behaves
# so that when you refactor, you don’t accidentally break it.
# ────────────────────────────────────────────
class StaticFilesTests(TestCase):

    def test_css_file_exists(self):
        self.assertIsNotNone(finders.find("game/css/style.css"))

    def test_js_file_exists(self):
        self.assertIsNotNone(finders.find("game/js/game.js"))


class GamePageTests(TestCase):

    def setUp(self):
        self.response = self.client.get(reverse("index"))

    def test_index_page_loads(self):
        """Main game page returns HTTP 200."""
        self.assertEqual(self.response.status_code, 200)

    def test_page_title(self):
        self.assertContains(self.response, "Cloud Gardener")

    def test_cloud_element_exists(self):
        self.assertContains(self.response, 'id="cloud"')

    def test_plant_element_exists(self):
        self.assertContains(self.response, 'id="plant"')

    def test_growth_bar_exists(self):
        self.assertContains(self.response, 'id="growth-bar"')

    def test_growth_fill_exists(self):
        self.assertContains(self.response, 'id="growth-fill"')

    def test_rain_container_exists(self):
        self.assertContains(self.response, 'id="rain-container"')


# ────────────────────────────────────────────
# AccessibilityTests class in Django for (index.html)
# verify that the public page is fully accessible and functional
# ────────────────────────────────────────────

class AccessibilityTests(TestCase):

    def setUp(self):
        self.response = self.client.get(reverse("index"))

    def test_html_lang_attribute(self):
        """<html lang="en"> must be set for screen readers."""
        self.assertContains(self.response, 'lang="en"')

    def test_charset_meta(self):
        self.assertContains(self.response, 'charset="UTF-8"')

    def test_viewport_meta(self):
        self.assertContains(self.response, 'name="viewport"')

    def test_growth_bar_progressbar_role(self):
        """Growth bar must have ARIA progressbar role for AT support."""
        self.assertContains(self.response, 'role="progressbar"')

    def test_growth_bar_aria_valuemin(self):
        self.assertContains(self.response, 'aria-valuemin="0"')

    def test_growth_bar_aria_valuemax(self):
        self.assertContains(self.response, 'aria-valuemax="100"')

    def test_controls_hint_present(self):
        """Player hint text must be visible."""
        self.assertContains(self.response, "arrow keys")


# ────────────────────────────────────────────
# Model unit tests
# ensure your model is functional, human-readable, predictable, and safe
# ────────────────────────────────────────────

class GameSessionModelTests(TestCase):

    def test_create_session(self):
        session = GameSession.objects.create(final_growth=0)
        self.assertEqual(session.final_growth, 0)
        self.assertIsNotNone(session.started_at)
        self.assertIsNone(session.completed_at)

    def test_str_representation(self):
        session = GameSession.objects.create(final_growth=55)
        self.assertIn("55", str(session))

    def test_ordering_newest_first(self):
        s1 = GameSession.objects.create(final_growth=10)
        s2 = GameSession.objects.create(final_growth=90)
        sessions = list(GameSession.objects.all())
        # newest (s2) should come first due to Meta ordering
        self.assertEqual(sessions[0].pk, s2.pk)

    def test_final_growth_max_100(self):
        """Game enforces 0–100 growth — model should store it faithfully."""
        session = GameSession.objects.create(final_growth=100)
        session.refresh_from_db()
        self.assertEqual(session.final_growth, 100)


# ────────────────────────────────────────────
# Regression tests (bug fixes locked in)
# ────────────────────────────────────────────

class GrowthLogicRegressionTests(TestCase):
    """
    These tests document the bugs found during Stage 0 audit and
    lock in the corrected behaviour so they can never regress.
    """

    def setUp(self):
        self.response = self.client.get(reverse("index"))

    def test_js_flower_stage_reachable(self):
        """
        BUG FIX: Original code had `growth >= 100` for flower stage, but
        growth increments by 2 so values 80–99 never triggered it.
        Refactored code uses threshold 80. This test confirms the JS
        source contains the corrected threshold value.
        """
        js_path = finders.find("game/js/game.js")
        self.assertIsNotNone(js_path, "game.js must exist")
        with open(js_path) as f:
            source = f.read()
        # Flower stage must be triggered at 80, not 100
        self.assertIn("threshold: 80", source)
        # The old broken guard must not be present
        self.assertNotIn("growth >= 100", source)

    def test_js_uses_strict_mode(self):
        """Refactored JS must declare 'use strict' to avoid silent global leaks."""
        js_path = finders.find("game/js/game.js")
        with open(js_path) as f:
            source = f.read()
        self.assertIn('"use strict"', source)

    def test_js_no_bare_globals(self):
        """
        Original code had bare global variables (let cloud, let x, etc.).
        Refactored code wraps state in IIFEs. Confirm the old patterns are gone.
        """
        js_path = finders.find("game/js/game.js")
        with open(js_path) as f:
            source = f.read()
        # Old top-level bare declarations should not exist outside an IIFE
        self.assertNotIn("let cloud =", source)
        self.assertNotIn("let growth =", source)

    def test_js_domcontentloaded_boot(self):
        """Game must boot on DOMContentLoaded, not immediately on script parse."""
        js_path = finders.find("game/js/game.js")
        with open(js_path) as f:
            source = f.read()
        self.assertIn("DOMContentLoaded", source)
