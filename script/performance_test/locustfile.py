import time
from locust import HttpUser, task
import random
import requests


class QuickstartUser(HttpUser):
    unique_email = 'test@email.com'
    unique_username = 'test_case'
    unique_id = 10000
    template_id = 0

    def on_start(self):
        response = self.client.post("login/", json={"email": "im@test.com", "password": "password"}).json()
        token = response['token']
        self.headers = {"authorization": "Token " + token}

    @task
    def open_register(self):
        email = QuickstartUser.unique_email + str(QuickstartUser.unique_id)
        username = QuickstartUser.unique_username + str(QuickstartUser.unique_id)
        QuickstartUser.unique_id += 1
        data = {'user_name': username,
                'email': email,
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                "location": "",
                "organization": 1}
        self.client.post("open-registration/", json=data)

    @task
    def access_system_admins(self):
        self.client.get('accessClients/', headers=self.headers)

    @task
    def access_employees_in_org(self):
        self.client.get('user/?organization=1', headers=self.headers)

    @task
    def create_employee(self):
        email = QuickstartUser.unique_email + str(QuickstartUser.unique_id)
        username = QuickstartUser.unique_username + str(QuickstartUser.unique_id)
        QuickstartUser.unique_id += 1
        data = {'user_name': username,
                'email': email,
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                "location": "",
                "organization": 1}
        self.client.post('user/', json=data, headers=self.headers)

    @task
    def modify_employee(self):
        data = {'first_name': 'name', 'role': 'IM', 'organization': 1}
        id = str(response['user_id'])
        self.client.patch('user/' + id + "/", json=data, headers=self.headers)

    @task
    def access_organizations(self):
        self.client.get('organization/', headers=self.headers)

    @task
    def create_organization(self):
        name = QuickstartUser.unique_username + str(QuickstartUser.unique_id)
        QuickstartUser.unique_id += 1
        data = {'org_name': name}
        self.client.post('organization/', json=data, headers=self.headers)

    @task
    def modify_org_job_time(self):
        data = {'new_job_timing': 50, 'organization': "1"}
        self.client.post('InventoryItemRefreshTime/', json=data, headers=self.headers)

    @task
    def access_specific_items(self):
        self.client.get(f'item/?page=1&page_size=25', headers=self.headers)

    @task
    def create_template(self):
        QuickstartUser.template_id += 1
        data1 = {
            "title": "bad title",
            "location": ['A certain location'],
            "plant": [],
            "zones": [],
            "aisles": [],
            "bins": [],
            "part_number": [],
            "serial_number": [],
            "description": "",
            "organization": 1
        }
        self.client.post('template/', json=data1, headers=self.headers)

    @task
    def delete_template(self):
        response = self.client.get('template/?organization=1', headers=self.headers, name="/template/?organization/").json()
        delete_id = None
        for template in response:
            if template['title'] == "bad title":
                delete_id = template['template_id']
        if delete_id is not None:
            self.client.delete('template/' + delete_id + '/', headers=self.headers, name="/template/?id/")

    @task
    def modify_template(self):
        self.client.get('template/c8c1a994-1f7d-4224-9091-2cfebafe2899/', headers=self.headers, name="/template/?id/")
        data2 = {"title": "title " + str(self.unique_id)}
        self.unique_id += 1
        self.client.patch('template/c8c1a994-1f7d-4224-9091-2cfebafe2899/', json=data2, headers=self.headers, name="/template/?id/")
