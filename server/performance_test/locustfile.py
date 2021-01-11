import time
from locust import HttpUser, task


class QuickstartUser(HttpUser):
    unique_email = 'test@email.com'
    unique_username = 'test_case'
    unique_id = 0
    do_one = True

    @task
    def login(self):
        if QuickstartUser.do_one:
            response = self.client.post("login/", json={"email": "sa@test.com", "password": "password"}).json()
            # print(response)
            # token = response['token']
            # headers = {'Authorization': 'Token ' + token}
            # user = response['user']
            # self.client.post("logout/", json={"user": response['user_id']})
            # QuickstartUser.do_one = False

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
        response = self.client.post("login/", json={"email": "sa@test.com", "password": "password"}).json()
        token = response['token']
        headers = {'Authorization': 'Token ' + token}
        self.client.get('accessClients/', headers=headers)

    @task
    def access_employees_in_org(self):
        response = self.client.post("login/", json={"email": "im@test.com", "password": "password"}).json()
        token = response['token']
        headers = {'Authorization': 'Token ' + token}
        self.client.get('user/?organization=1', headers=headers)

    @task
    def create_employee(self):
        response = self.client.post("login/", json={"email": "im@test.com", "password": "password"}).json()
        token = response['token']
        headers = {'Authorization': 'Token ' + token}
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
        self.client.post('user/', json=data, headers=headers)

    @task
    def modify_employee(self):
        response = self.client.post("login/", json={"email": "im@test.com", "password": "password"}).json()
        token = response['token']
        headers = {'Authorization': 'Token ' + token}
        data = {'first_name': 'name', 'role': 'IM', 'organization': 1}
        id = str(response['user_id'])
        self.client.patch('user/' + id + "/", json=data, headers=headers)

    @task
    def access_organizations(self):
        response = self.client.post("login/", json={"email": "sa@test.com", "password": "password"}).json()
        token = response['token']
        headers = {'Authorization': 'Token ' + token}
        self.client.get('organization/', headers=headers)

    @task
    def create_organization(self):
        response = self.client.post("login/", json={"email": "sa@test.com", "password": "password"}).json()
        token = response['token']
        headers = {'Authorization': 'Token ' + token}
        name = QuickstartUser.unique_username + str(QuickstartUser.unique_id)
        QuickstartUser.unique_id += 1
        data = {'org_name': name}
        self.client.post('organization/', json=data, headers=headers)

    @task
    def modify_org_job_time(self):
        response = self.client.post("login/", json={"email": "sa@test.com", "password": "password"}).json()
        token = response['token']
        headers = {'Authorization': 'Token ' + token}
        data = {'new_job_timing': 50, 'organization': "1"}
        self.client.post('InventoryItemRefreshTime/', json=data, headers=headers)

