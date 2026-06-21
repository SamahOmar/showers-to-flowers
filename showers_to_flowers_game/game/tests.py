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
    js_modules = [
        "game/js/game.js",
        "game/js/constants.js",
        "game/js/cloud-controller.js",
        "game/js/rain-engine.js",
        "game/js/plant-controller.js",
        "game/js/growth-bar.js",
        "game/js/cutscene.js",
        "game/js/confetti.js",
        "game/js/ambient-clouds.js",
        "game/js/game-state.js",
        "game/js/lives-ui.js",
        "game/js/sheep-controller.js",
    ]

    def test_css_file_exists(self):
        self.assertIsNotNone(finders.find("game/css/style.css"))

    def test_js_file_exists(self):
        for module_path in self.js_modules:
            with self.subTest(module_path=module_path):
                self.assertIsNotNone(finders.find(module_path))

    def test_favicon_file_exists(self):
        self.assertIsNotNone(finders.find("game/img/favicon.svg"))


class GamePageTests(TestCase):

    def setUp(self):
        self.response = self.client.get(reverse("index"))

    def test_index_page_loads(self):
        """Main game page returns HTTP 200."""
        self.assertEqual(self.response.status_code, 200)

    def test_page_title(self):
        self.assertContains(self.response, "Cloud Gardener")

    def test_favicon_is_linked(self):
        self.assertContains(self.response, 'rel="icon"')
        self.assertContains(self.response, "game/img/favicon.svg")

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

    def test_lives_element_exists(self):
        self.assertContains(self.response, 'id="lives"')
        self.assertContains(self.response, 'aria-label="3 attempts remaining"')

    def test_level_and_retry_feedback_elements_exist(self):
        self.assertContains(self.response, 'id="level-badge"')
        self.assertContains(self.response, 'id="round-banner"')

    def test_sheep_element_exists(self):
        self.assertContains(self.response, 'id="sheep"')
        self.assertContains(self.response, 'aria-label="Hungry sheep"')

    def test_game_javascript_loads_as_module(self):
        self.assertContains(self.response, 'type="module"')
        self.assertContains(self.response, "game/js/game.js")

    def test_favicon_request_redirects_to_static_file(self):
        response = self.client.get("/favicon.ico")
        self.assertEqual(response.status_code, 301)
        self.assertEqual(response["Location"], "/static/game/img/favicon.svg")


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

    def test_js_flower_stage_waits_for_full_growth(self):
        """
        The flower should only appear when the progress bar is full.
        """
        js_path = finders.find("game/js/constants.js")
        self.assertIsNotNone(js_path, "game.js must exist")
        with open(js_path, encoding="utf-8") as f:
            source = f.read()
        self.assertNotIn('label: "flower"', source)
        self.assertIn("BLOOM: 100", source)
        self.assertIn('label: "bloom"', source)

    def test_js_uses_strict_mode(self):
        """Refactored JS must declare 'use strict' to avoid silent global leaks."""
        js_path = finders.find("game/js/game.js")
        with open(js_path, encoding="utf-8") as f:
            source = f.read()
        self.assertIn('"use strict"', source)

    def test_js_is_split_into_single_responsibility_modules(self):
        """
        The entrypoint should orchestrate modules instead of holding every
        controller implementation.
        """
        js_path = finders.find("game/js/game.js")
        with open(js_path, encoding="utf-8") as f:
            source = f.read()
        self.assertIn('from "./cloud-controller.js"', source)
        self.assertIn('from "./plant-controller.js"', source)
        self.assertIn('from "./rain-engine.js"', source)
        self.assertIn('from "./sheep-controller.js"', source)
        self.assertLess(len(source.splitlines()), 160)

    def test_js_domcontentloaded_boot(self):
        """Game must boot on DOMContentLoaded, not immediately on script parse."""
        js_path = finders.find("game/js/game.js")
        with open(js_path, encoding="utf-8") as f:
            source = f.read()
        self.assertIn("DOMContentLoaded", source)

    def test_cloud_keyboard_controls_are_enabled(self):
        """Cloud movement must remain wired to left/right arrow keys."""
        js_path = finders.find("game/js/cloud-controller.js")
        with open(js_path, encoding="utf-8") as f:
            source = f.read()
        self.assertIn('window.addEventListener("keydown", handleKey', source)
        self.assertIn('e.key === "ArrowLeft"', source)
        self.assertIn('e.key === "ArrowRight"', source)
        entrypoint_path = finders.find("game/js/game.js")
        with open(entrypoint_path, encoding="utf-8") as f:
            entrypoint = f.read()
        self.assertIn("gameLayer.focus", entrypoint)
        self.assertIn("CloudController.enable()", entrypoint)

    def test_sheep_interference_is_wired_to_lives(self):
        sheep_source = finders.find("game/js/sheep-controller.js")
        self.assertIsNotNone(sheep_source)
        with open(sheep_source, encoding="utf-8") as f:
            source = f.read()
        self.assertIn("startHunt", source)
        self.assertIn("onFlowerEaten", source)
        self.assertIn("onScaredAway", source)

        state_source = finders.find("game/js/game-state.js")
        self.assertIsNotNone(state_source)
        with open(state_source, encoding="utf-8") as f:
            source = f.read()
        self.assertIn("INITIAL_LIVES = 3", source)
        self.assertIn("loseLife", source)

    def test_overwatering_uses_failure_path(self):
        entrypoint_path = finders.find("game/js/game.js")
        self.assertIsNotNone(entrypoint_path)
        with open(entrypoint_path, encoding="utf-8") as f:
            source = f.read()
        self.assertIn("handleOverwatered", source)
        self.assertIn("Too much water wilted the flower.", source)
        self.assertIn("onOverwatered: handleOverwatered", source)

    def test_bloom_advances_to_level_two(self):
        entrypoint_path = finders.find("game/js/game.js")
        self.assertIsNotNone(entrypoint_path)
        with open(entrypoint_path, encoding="utf-8") as f:
            source = f.read()
        self.assertIn("GameState.advanceLevel()", source)
        self.assertIn('showRoundBanner("Level 2")', source)

    def test_attempt_banner_is_gated_by_attempt_change(self):
        entrypoint_path = finders.find("game/js/game.js")
        self.assertIsNotNone(entrypoint_path)
        with open(entrypoint_path, encoding="utf-8") as f:
            source = f.read()
        self.assertIn("showAttemptBannerIfChanged", source)
        self.assertEqual(source.count("Attempt ${"), 1)

    def test_scared_sheep_faces_retreat_direction(self):
        sheep_source = finders.find("game/js/sheep-controller.js")
        self.assertIsNotNone(sheep_source)
        with open(sheep_source, encoding="utf-8") as f:
            source = f.read()
        self.assertIn("faceDirection", source)
        self.assertIn('sheep.classList.toggle("from-right", direction < 0)', source)
