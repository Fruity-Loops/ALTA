import os
import django

# This must be executed before the rest of the imports
# Setup the django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'django_server.settings')
django.setup()

import random
import string
from django_seed import Seed
import json
from organization.models import Organization
from user_account.models import CustomUser
from inventory_item.models import Item
from audit_template.models import AuditTemplate
from audit.models import Audit, BinToSK, Record
from user_account.serializers import CustomUserSerializer
from inventory_item.serializers import ItemSerializer
import datetime

LOCATIONS = ['Montreal', 'Florida']


def create_orgs_users_items_templates(seeder):
    seeder.add_entity(Organization, 1, {
        'org_name': lambda x: seeder.faker.company(),
        "address": lambda x: seeder.faker.city(),
        "status": True,
        "inventory_items_refresh_job": 1,
        "calendar_date": "2021/01/02"
    })

    seeder.add_entity(CustomUser, 10, {
        "password": "pbkdf2_sha256$180000$YRa1Lx38lUUM$pl2C1K/G0vZZMFBuTBo+ohBn8sqeoVYlTqYtko0muDk=",
        "last_login": None,
        "user_name": lambda x: seeder.faker.simple_profile()['username'],
        "first_name": lambda x: seeder.faker.first_name(),
        "last_name": lambda x: seeder.faker.last_name(),
        "role": lambda x: random.choices(["IM", "SK"], weights=(30, 70))[0],
        "is_active": lambda x: random.choices([True, False], weights=(95, 5))[0],
        "location": lambda x: random.choice(LOCATIONS),
        "email": lambda x: seeder.faker.email(),
    })

    seeder.add_entity(Item, 100, {
        "Location": lambda x: random.choice(LOCATIONS),
        "Plant": lambda x: f'Plant-{random.randint(1, 10)}',
        "Zone": lambda x: random.choice(string.ascii_uppercase),
        "Aisle": lambda x: random.randint(1, 1000),
        "Bin": lambda x: f'{random.choice(["A", "B", "C"])}{random.randint(1, 5)}',
        "Part_Number": lambda x: f'PART-{random.randint(1, 1000)}',
        "Part_Description": lambda x: seeder.faker.sentence(),
        "Serial_Number": lambda x: f'SN-{random.randint(1, 100)}',
        "Condition": lambda x: random.choice(['Serviceable', 'KIT', 'MODIFIED', 'NEW', 'EXC', 'LTU', 'SURPLUS']),
        "Category": lambda x: random.choice(['SERIALIZED', 'KIT', 'SOFTWARE', 'XPENDBL', 'NON-SER']),
        "Owner": lambda x: seeder.faker.company(),
        "Criticality": lambda x: random.choice(['No-Go', 'Non-Critical']),
        "Average_Cost": lambda x: f" ${random.randint(1, 100000)},000.00 ",
        "Quantity": lambda x: random.randint(1, 1000000),
        "Unit_of_Measure": lambda x: random.choice(['EA', 'OZ', 'BX200', 'CS48']),
    })

    seeder.add_entity(AuditTemplate, 10, {
        "author": lambda x: seeder.faker.simple_profile()['username'],
        "title": lambda x: seeder.faker.sentence(),
        "location": lambda x: [random.choice(LOCATIONS)],
        "plant": [],
        "zones": [],
        "aisles": [],
        "bins": [],
        "part_number": [],
        "description": "",
        "serial_number": [],
        "start_date": "2021-02-04T21:57:00.012Z",
        "repeat_every": "1",
        "on_day": ["True", "True", "False", "False", "False", "False", "False"],
        "for_month": ["True", "True", "False", "False", "False", "False", "False", "False", "False", "False", "False",
                      "False"],
        "calendar_date": "January 08, 2021",
        "time_zone_utc": "America/Detroit",
    })

    # insert the created instances into the DB and returned the primary keys of these instances
    inserted_pks = seeder.execute()
    return inserted_pks

def get_random_list_of_items(org_id):
    # get all the items from the organization
    queryset = Item.objects.all().filter(organization=org_id)

    # return a random subset of the list
    random_size = random.randint(1, len(queryset))
    items = queryset[:random_size]
    return items

def create_audit(seeder, org_id, user_ids, item_ids, template_ids):
    # get the organization object from the DB to be used while creating the audit
    organization = Organization.objects.get(pk=org_id)

    # Select a random template and get the Template object from the DB to be used while creating the audit
    random_template_id = random.choice(template_ids)
    audit_template = AuditTemplate.objects.get(pk=random_template_id)

    # select a random user from the organization to be the one who initiates the audit
    initiated_by_id = random.choice(user_ids)
    initiated_by = CustomUser.objects.get(pk=initiated_by_id)

    seeder.add_entity(Audit, 1, {
        # 'status': lambda x: random.choice(['Pending', 'Complete', 'Active']),
        'status': lambda x: random.choice(['Active']),
        'organization': organization,
        'initiated_by': initiated_by,
        'template_id': audit_template,
        'initiated_on': datetime.datetime.now(),
        'last_modified_on': datetime.datetime.now()
    })

    # insert the audit to the DB
    # Note the audit will not have items or assigned SKs yet
    inserted_pks = seeder.execute()

    # To set the items and assigned SKs to an audit, we first retrieve it from the DB
    inserted_audit_id = inserted_pks[Audit][0]
    inserted_audit = Audit.objects.get(pk=inserted_audit_id)

    # We get a random list of inventory_items to assign them to the audit
    items = get_random_list_of_items(org_id)
    inserted_audit.inventory_items.set(items)

    bins = get_bins_from_audit_items(org_id, items)

    assigned_SKs = []
    for bin_info in bins.values():
        assigned_SKs.append(bin_info['assigned_SK'])
        create_BintoSK_and_record(seeder, org_id, inserted_audit,  bin_info)

    inserted_audit.assigned_sk.set(assigned_SKs)

    set_audit_accuracy(inserted_audit_id)

    return


def create_BintoSK_and_record(seeder, org_id, audit, bin_info):

    print(bin_info)
    bin_name = bin_info['bin_name']
    item_ids = bin_info['item_ids']
    location = bin_info['location']
    assigned_SK = bin_info['assigned_SK']

    # if a bin's status is complete, then there should be a record for all items within it
    seeder.add_entity(BinToSK, 1, {
        'Bin': bin_name,
        'init_audit': audit,
        'customuser': assigned_SK,
        'item_ids': item_ids,
        'status': lambda x: random.choice(['Pending']),
    })

    for item_id in item_ids:

        # randomly choose some items to have records
        if random.randint(0, 100) < 30:
            seeder.add_entity(Record, 1, {

                'status': lambda x: random.choice(['Provided']),
                'item_id': item_id,
                'audit': audit,
            })

    inserted_pks = seeder.execute()
    bin_id = inserted_pks[BinToSK][0]
    set_bin_accuracy(bin_id)

    return


def get_bins_from_audit_items(org_id, items):
    # we need the serializer to serialize the queryset
    serializer_class = ItemSerializer
    serializer_class.Meta.fields = ['pk', 'Bin', 'Location']

    serializer = serializer_class(items, many=True).data
    items = [item for item in serializer]

    # create a dict to store the unique bins
    bins = {}

    # iterate through the items
    for item in items:
        bin_name = item['Bin']
        item_id = item['pk']
        location = item['Location']
        bin_id = f'{bin_name}{location}'

        # set the bins as the keys and the tuple as the values
        if bin_id in bins:
            bins[bin_id]['item_ids'].append(item_id)
        else:
            assigned_SK = get_random_SK_from_location(org_id, location)
            bin_info = {
                'bin_name':bin_name,
                'item_ids': [item_id],
                'location': location,
                'assigned_SK': assigned_SK
            }
            bins[bin_id] = bin_info

    return bins


def get_random_SK_from_location(org_id, location):
    queryset = CustomUser.objects.all().filter(organization=org_id).filter(role='SK').filter(location=location).filter(is_active=True)
    random_id = random.randint(0, len(queryset) - 1)
    random_SK = queryset[random_id]
    return random_SK


def set_audit_accuracy(audit_id):
    audit = Audit.objects.get(audit_id=audit_id)
    records = Record.objects.filter(audit=audit_id)
    audit_accuracy = calculate_accuracy(records)
    setattr(audit, 'accuracy', audit_accuracy)
    audit.save()


def set_bin_accuracy(bin_id):
    bintosk = BinToSK.objects.get(bin_id=bin_id)
    records = Record.objects.filter(bin_to_sk=bin_id)
    bin_accuracy = calculate_accuracy(records)
    setattr(bintosk, 'accuracy', bin_accuracy)
    bintosk.save()


def calculate_accuracy(record_queryset):
    missing = record_queryset.filter(status='Missing').count()
    found = record_queryset.filter(status='Provided').count()
    total_records_no_new = found + missing
    return 0.0 if total_records_no_new == 0 else found / total_records_no_new

if __name__ == "__main__":
    # create a django-seed seeder
    seeder = Seed.seeder()

    # create an organization and its users, items, and audit templates
    inserted_pks = create_orgs_users_items_templates(seeder)

    # get the primary keys of the created instances
    created_org_id = inserted_pks[Organization][0]
    created_user_ids = inserted_pks[CustomUser]
    created_item_ids = inserted_pks[Item]
    created_template_ids = inserted_pks[AuditTemplate]

    create_audit(seeder, created_org_id, created_user_ids, created_item_ids, created_template_ids)
