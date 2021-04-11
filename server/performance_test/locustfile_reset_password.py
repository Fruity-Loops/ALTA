from locust import HttpUser, task


class User(HttpUser):

    @task
    def reset_password(self):
        data = {'email': 'im@test.com'}
        self.client.post('reset-password/', json=data, name='/reset-password')
