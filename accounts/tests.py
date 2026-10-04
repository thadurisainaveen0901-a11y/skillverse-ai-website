from django.test import TestCase, Client
from django.contrib.auth.models import User
import json


class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_register_success(self):
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'newuser',
                'email': 'new@example.com',
                'password': 'newpass123',
                'full_name': 'New User'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_duplicate_username(self):
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'testuser',
                'email': 'other@example.com',
                'password': 'pass123',
                'full_name': 'Test'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_login_success(self):
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

    def test_login_invalid(self):
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'username': 'testuser',
                'password': 'wrongpass'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)

    def test_profile_authenticated(self):
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get('/api/auth/me')
        self.assertEqual(response.status_code, 200)

    def test_profile_unauthenticated(self):
        response = self.client.get('/api/auth/me')
        self.assertEqual(response.status_code, 401)
