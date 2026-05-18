from django.test import TestCase
from django.urls import reverse
from django.contrib.staticfiles import finders


class StaticFilesTests(TestCase):

    def test_css_file_exists(self):
        file = finders.find("game/css/style.css")
        self.assertIsNotNone(file)

    def test_js_file_exists(self):
        file = finders.find("game/js/game.js")
        self.assertIsNotNone(file)

class GamePageTests(TestCase):

    def test_index_page_loads(self):
        """Main game page loads successfully"""
        response = self.client.get(reverse("index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Cloud Gardener")

    def test_cloud_element_exists(self):
        """Cloud element is in HTML"""
        response = self.client.get(reverse("index"))
        self.assertContains(response, "id=\"cloud\"")

    def test_plant_element_exists(self):
        """Plant element is in HTML"""
        response = self.client.get(reverse("index"))
        self.assertContains(response, "id=\"plant\"")
# Create your tests here.
