import time
from locust import HttpUser, task


class QuickstartUser(HttpUser):

    def on_start(self):
        self.client.post("login/", json={"email": "sa@test.com", "password": "password"})

    @task
    def view_item(self):
        self.client.get("item/")
