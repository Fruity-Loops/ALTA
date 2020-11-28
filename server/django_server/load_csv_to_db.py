import os
import pymongo as pym
import pandas as pd
import random


def get_collection(collection_name):
    # Making connection to mongoclient
    client = pym.MongoClient("mongodb://localhost:27017/")

    # Specifying a DB
    database = client["alta_development"]

    return database[collection_name]


def clean_data(csv_file, dummy_org_id):
    dataframe = pd.read_csv(csv_file)

    # Renaming column to be compatible with models fields ( which doesn't contain spaces'
    dataframe = dataframe.rename(columns={'Batch Number': '_id', 'Part Number': 'Part_Number',
                                          'Part Description': 'Part_Description',
                                          'Serial Number': 'Serial_Number',
                                          'Average Cost': 'Average_Cost',
                                          'Unit of Measure (UoM)': 'Unit_of_Measure'})

    # Cleaning dataframe
    dataframe = dataframe.dropna(subset=['_id'])

    # TODO : remove that when centralized db implemented
    dataframe["organization"] = dummy_org_id

    return dataframe.to_dict('records')


def populate_items(csv_file, collection_name, dummy_org_id):
    collection = get_collection(collection_name)
    dict_of_records = clean_data(csv_file, dummy_org_id)

    try:
        collection.insert_many(dict_of_records)
        print("Data inserted successfully")
    except pym.errors.BulkWriteError as error:
        for i in range(len(error.details["writeErrors"])):

            # If the error is different to duplicate key entry
            if error.details["writeErrors"][i]["code"] != 11000:
                print("An error occured")


def update_items(csv_file, collection_name, org_name, dummy_org_id):
    collection = get_collection(collection_name)
    dict_of_records = clean_data(csv_file, dummy_org_id)

    try:
        for document in dict_of_records:
            collection.update({'_id': document["_id"]}, document, upsert=True)
        print("Data Refreshed for organization: " + str(org_name))
    except pym.errors.BulkWriteError as error:
        print(error)


# TODO: delete that when we have our centralized db
def create_dummy_organization():
    from user_account.models import CustomUser
    from organization.models import Organization
    from rest_framework.test import APITestCase
    from rest_framework.test import APIClient

    client = APIClient()

    # Create a user that could be making the  request
    try:
        system_admin = CustomUser.objects.get(user_name="test")
        client.force_authenticate(user=system_admin)
    except CustomUser.DoesNotExist:
        system_admin = CustomUser.objects.create(
            id=random.randint(600, 700),
            user_name='test',
            email='test@email.com',
            password='password1',
            first_name='system1',
            last_name='admin1',
            role='SA',
            is_active=True)
        client.force_authenticate(user=system_admin)

    # Create an organization that could be linked to the inventory items
    try:
        organization = Organization.objects.get(org_name='test_organization')
        return organization.org_id
    except Organization.DoesNotExist:
        data = {'org_name': 'test_organization'}
        response = client.post("/organization/", data)
        return response.data["org_id"]


def main(org_name, is_initializing=False):
    dummy_org_id = create_dummy_organization()
    current_path = os.path.dirname(__file__)
    csv = os.path.join(current_path, "test_organization.csv")
    if is_initializing:
        populate_items(csv, "inventory_item_item", dummy_org_id)
    else:
        update_items(csv, "inventory_item_item", org_name, dummy_org_id)
