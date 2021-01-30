import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'django_server.settings')

import django

django.setup()

############
import random
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
    "role": lambda x: random.choice(["IM", "SK"]),
    "is_active": True,
    "location": lambda x: seeder.faker.city(),
    "email": lambda x: seeder.faker.email(),
})
#
#
from inventory_item.models import Item


def infinite_sequence():
    num = 1
    while True:
        yield num
        num += 1


gen = infinite_sequence()

seeder.add_entity(Item, 300000, {
    "_id": lambda x: next(gen),
    "Location": lambda x: seeder.faker.city(),
    "Plant": "True",
    "Zone": lambda x: random.choice(['A', 'B', 'C']),
    "Aisle": lambda x: random.randint(1, 1000),
    "Bin": lambda x: random.choice(['B1', 'B2', 'B3']),
    "Part_Number": lambda x: f'PART-{random.randint(1, 1000)}',
    "Part_Description": lambda x: seeder.faker.sentence(),
    "Serial_Number": "SN-4",
    "Condition": "Serviceable",
    "Category": "SERIALIZED",
    "Owner": "FG",
    "Criticality": None,
    "Average_Cost": " $9,000.00 ",
    "Quantity": lambda x: random.randint(1, 1000),
    "Unit_of_Measure": "EA",
})

inserted_pks = seeder.execute()
