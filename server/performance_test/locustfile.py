import time
from locust import HttpUser, task, between
import random
import string


class IMUser(HttpUser):
    weight = 9

    def on_start(self):
        self.response = self.client.post("login/", json={"email": "im@test.com", "password": "password"},
                                         name='/IM-login/').json()
        self.org = 1
        token = self.response['token']
        self.headers = {"authorization": "Token " + token}

    @task
    def modify_employee(self):
        data = {'first_name': 'name', 'role': 'IM', 'organization': self.org}
        id = str(self.response['user_id'])
        self.client.patch('user/' + id + "/", json=data, headers=self.headers, name='/user/?id')

    @task
    def access_specific_items(self):
        self.client.get(f'item/?page=1&page_size=25', headers=self.headers, name='/item/?page&?page_size')

    @task
    def create_template(self):
        # generate random title for the template
        letters = string.ascii_lowercase
        title = ''.join(random.choice(letters) for i in range(15))

        data1 = {
            "title": title,
            "location": ['A certain location'],
            "plant": [],
            "zones": [],
            "aisles": [],
            "bins": [],
            "part_number": [],
            "serial_number": [],
            "description": "",
            "organization": self.org
        }
        self.client.post('template/', json=data1, headers=self.headers)

        response = self.client.get(f'template/?organization={self.org}', headers=self.headers,
                                   name="/template/?organization/").json()
        new_temp_id = None
        for template in response:
            if template['title'] == title:
                new_temp_id = template['template_id']
                break

        if new_temp_id is not None:
            new_title = f'new {title}'
            new_data = {"title": new_title}
            self.client.patch(f'template/{new_temp_id}/', json=new_data, headers=self.headers, name="/template/?id/")
            self.client.delete(f'template/{new_temp_id}/', headers=self.headers, name="/template/?id/")

    @task
    def get_audit(self):
        data = {'organization': 1, 'status': 'Active'}
        id = str(self.response['user_id'])
        self.client.get('audit/', json=data, headers=self.headers, name='/audit/?id')

    @task
    def get_proper_audit(self):
        data = {'organization': 1, 'status': 'Active'}
        id = str(self.response['user_id'])
        self.client.get('audit/proper_audits/', json=data, headers=self.headers, name='/audit/proper_audits/?id')

    @task
    def get_audit_progression_metrics(self):
        data = {'audit_id': 1, 'status': 'Active'}
        id = str(self.response['user_id'])
        self.client.get('audit/progression_metrics/' + id + "/", json=data, headers=self.headers, name='/audit/progression_metrics/?id')

    # @task
    # def create_delete_bin(self):
    #     data = {
    #         "Bin": "A10",
    #         "init_audit": random_id,
    #         "customuser": 3,
    #         "item_ids": [12731370]
    #     }
    #     id = str(self.response['user_id'])
    #     response = self.client.post('audit/bin-to-sk/', json=data, headers=self.headers, name='/bin-to-sk/')
    #     self.client.delete('audit/bin-to-sk/' + response['bin_id'], json=data, headers=self.headers, name='/bin-to-sk/')

    @task
    def modify_bin(self):
        data = {
            "item_ids": [12731371]
        }
        id = str(self.response['user_id'])
        self.client.patch('audit/bin-to-sk/' + str(2) + "/", json=data, headers=self.headers, name='/bin-to-sk/')

    @task
    def get_bins(self):
        data = {
            "customuser_id": 3,
            "bin_status": "Pending",
            "init_audit_id": 1
        }
        id = str(self.response['user_id'])
        self.client.get('audit/bin-to-sk/', json=data, headers=self.headers, name='/bin-to-sk/')

    @task
    def get_bin_progression_metrics(self):
        data = {
            "bin_id": 2,
        }
        id = str(self.response['user_id'])
        self.client.get('audit/bin-to-sk/progression_metrics', json=data, headers=self.headers, name='/bin-to-sk/progression_metrics/')

    @task
    def get_items_in_bin(self):
        data = {
            "bin_id": 2,
            "audit_id": 1
        }
        id = str(self.response['user_id'])
        self.client.get('audit/bin-to-sk/items', json=data, headers=self.headers, name='/bin-to-sk/items/')

    @task
    def record_operations(self):
        data = {
            "status": "Pending",
            "audit": 1,
            "bin_to_sk": 2,
            "item_id": 12731370,
            "location": "YUL"
        }
        id = str(self.response['user_id'])
        response = self.client.post('audit/record/', json=data, headers=self.headers, name='/record/')
        response = self.client.get('audit/record/completed_items/', json={"status": "Pending"}, headers=self.headers, name='/record/completed_items/')
        response = self.client.patch('audit/record/', json={"location": "Florida"}, headers=self.headers, name='/record/')
        self.client.delete('audit/record/' + response['record_id'], headers=self.headers, name='/record/')

    @task
    def get_reccomendations(self):
        data = {
            "organization": 1
        }
        id = str(self.response['user_id'])
        self.client.get('recommendation/', json=data, headers=self.headers, name='/recommendation/')

    @task
    def assignment_operations(self):
        data = {
            "audit": 1,
            "assigned_sk": 3
        }
        id = str(self.response['user_id'])
        response = self.client.post('assignment/', json=data, headers=self.headers, name='/assignment/')
        response = self.client.get('assignment/', json={"organization": 1}, headers=self.headers, name='/assignment/')
        response = self.client.patch('assignment/', json={"assigned_sk": 3}, headers=self.headers, name='/assignment/')
        self.client.delete('assignment/' + response['id'], headers=self.headers, name='/assignment/')


class SAUser(HttpUser):
    weight = 1

    def on_start(self):
        self.response = self.client.post("login/", json={"email": "sa@test.com", "password": "password"},
                                         name='/SA-login/').json()
        token = self.response['token']
        self.headers = {"authorization": "Token " + token}

    @task
    def access_system_admins(self):
        self.client.get('accessClients/', headers=self.headers)

    @task
    def access_employees_in_org(self):
        org_id = random.choice([1, 2, 3])
        self.client.get(f'user/?organization={org_id}', headers=self.headers, name='/user/?organization')

    @task
    def access_organizations(self):
        self.client.get('organization/', headers=self.headers)

    @task
    def create_organization(self):
        # generate random organization name
        letters = string.ascii_lowercase
        org_name = ''.join(random.choice(letters) for i in range(15))
        data = {'org_name': org_name}
        self.client.post('organization/', json=data, headers=self.headers)

    @task
    def modify_org_job_time(self):
        data = {'new_job_timing': 50, 'organization': "1"}
        self.client.post('InventoryItemRefreshTime/', json=data, headers=self.headers)

    @task
    def create_employee(self):
        # generate random user_name and email
        letters = string.ascii_lowercase
        user_name = ''.join(random.choice(letters) for i in range(15))
        email = f'{user_name}@test.com'

        data = {'user_name': user_name,
                'email': email,
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                "location": ""
                }
        self.client.post('user/', json=data, headers=self.headers)

    @task
    def open_register(self):
        # generate random user_name and email
        letters = string.ascii_lowercase
        user_name = ''.join(random.choice(letters) for i in range(15))
        email = f'{user_name}@test.com'

        data = {'user_name': user_name,
                'email': email,
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                "location": ""
                }
        self.client.post("open-registration/", json=data)

