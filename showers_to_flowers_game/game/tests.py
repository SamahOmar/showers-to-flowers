from django.test import TestCase
from django.urls import reverse
from django.contrib.staticfiles import finders


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
