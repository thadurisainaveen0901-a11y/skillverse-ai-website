from django.test import TestCase, Client
from django.contrib.auth.models import User


class AdminTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )

    def test_admin_login_page(self):
        response = self.client.get('/admin-panel/')
        self.assertEqual(response.status_code, 200)

    def test_admin_dashboard_requires_auth(self):
        response = self.client.get('/admin-panel/dashboard/')
        self.assertEqual(response.status_code, 302)

    def test_admin_dashboard_authenticated(self):
        self.client.login(username='admin', password='admin123')
        response = self.client.get('/admin-panel/dashboard/')
        self.assertEqual(response.status_code, 200)

    def test_admin_users_authenticated(self):
        self.client.login(username='admin', password='admin123')
        response = self.client.get('/admin-panel/users/')
        self.assertEqual(response.status_code, 200)

    def test_admin_interviews_authenticated(self):
        self.client.login(username='admin', password='admin123')
        response = self.client.get('/admin-panel/interviews/')
        self.assertEqual(response.status_code, 200)

    def test_admin_settings_authenticated(self):
        self.client.login(username='admin', password='admin123')
        response = self.client.get('/admin-panel/settings/')
        self.assertEqual(response.status_code, 200)
