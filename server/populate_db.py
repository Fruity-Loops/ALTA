import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'django_server.settings')

import django

django.setup()

############
import random
import string
from django_seed import Seed

seeder = Seed.seeder()

from organization.models import Organization

seeder.add_entity(Organization, 3, {
    'org_name': lambda x: seeder.faker.company(),
    "address": lambda x: seeder.faker.city(),
    "status": True,
    "inventory_items_refresh_job": 1,
    "calendar_date": "2021/01/02"
})

from user_account.models import CustomUser

seeder.add_entity(CustomUser, 100, {
    "password": "pbkdf2_sha256$180000$YRa1Lx38lUUM$pl2C1K/G0vZZMFBuTBo+ohBn8sqeoVYlTqYtko0muDk=",
    "last_login": None,
    "user_name": lambda x: seeder.faker.simple_profile()['username'],
    "first_name": lambda x: seeder.faker.first_name(),
    "last_name": lambda x: seeder.faker.last_name(),
    "role": lambda x: random.choices(["IM", "SK"], weights=(30, 70))[0],
    "is_active": lambda x: random.choices([True, False], weights=(90, 10))[0],
    "location": lambda x: seeder.faker.city(),
    "email": lambda x: seeder.faker.email(),
})


from inventory_item.models import Item

def infinite_sequence():
    num = 300
    while True:
        yield num
        num += 1

gen = infinite_sequence()

seeder.add_entity(Item, 1000, {
    "_id": lambda x: seeder.faker.ean13(),
    "Location": lambda x: random.choice([seeder.faker.city_suffix(), seeder.faker.city()]),
    "Plant": lambda x: f'Plant-{random.randint(1, 10)}',
    "Zone": lambda x: random.choice(string.ascii_uppercase),
    "Aisle": lambda x: random.randint(1, 1000),
    "Bin": lambda x: f'{random.choice(string.ascii_uppercase)}{random.randint(1, 1000)}',
    "Part_Number": lambda x: f'PART-{random.randint(1, 1000)}',
    "Part_Description": lambda x: seeder.faker.sentence(),
    "Serial_Number": lambda x: f'SN-{random.randint(1, 100)}',
    "Condition": lambda x: random.choice(['Serviceable', 'Broken']),
    "Category": lambda x: random.choice(['SERIALIZED']),
    "Owner": lambda x: seeder.faker.company(),
    "Criticality": lambda x: random.choice(['High', 'Medium', 'Low']),
    "Average_Cost":lambda x: f" ${random.randint(1, 1000)},000.00 ",
    "Quantity": lambda x: random.randint(1, 1000),
    "Unit_of_Measure": lambda x: random.choice(['EA']),
})

inserted_pks = seeder.execute()
