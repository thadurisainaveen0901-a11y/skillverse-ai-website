from django.test import TestCase, Client


class CoreTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_home_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_login_page(self):
        response = self.client.get('/login/')
        self.assertEqual(response.status_code, 200)

    def test_register_page(self):
        response = self.client.get('/register/')
        self.assertEqual(response.status_code, 200)

    def test_dashboard_page(self):
        response = self.client.get('/dashboard/')
        self.assertEqual(response.status_code, 200)

    def test_resume_page(self):
        response = self.client.get('/resume/')
        self.assertEqual(response.status_code, 200)

    def test_interview_page(self):
        response = self.client.get('/interview/')
        self.assertEqual(response.status_code, 200)

    def test_about_page(self):
        response = self.client.get('/about/')
        self.assertEqual(response.status_code, 200)

    def test_features_page(self):
        response = self.client.get('/features/')
        self.assertEqual(response.status_code, 200)

    def test_contact_page(self):
        response = self.client.get('/contact/')
        self.assertEqual(response.status_code, 200)

    def test_admin_login_page(self):
        response = self.client.get('/admin-panel/')
        self.assertEqual(response.status_code, 200)

    def test_404_page(self):
        response = self.client.get('/nonexistent-page/')
        self.assertEqual(response.status_code, 404)
