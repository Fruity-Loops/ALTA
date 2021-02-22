import os
import logging
import pymongo as pym
import pandas as pd


logger = logging.getLogger(__name__)

def get_collection(collection_name):
    # Making connection to mongoclient
    client = pym.MongoClient("mongodb://localhost:27017/")

    # Specifying a DB
    database = client["alta_development"]

    return database[collection_name]


def clean_data(csv_file, org_id):
    dataframe = pd.read_csv(csv_file)

    # Renaming column to be compatible with models fields ( which doesn't contain spaces'
    dataframe = dataframe.rename(columns={'Batch Number': 'Batch_Number',
                                          'Part Number': 'Part_Number',
                                          'Part Description': 'Part_Description',
                                          'Serial Number': 'Serial_Number',
                                          'Average Cost': 'Average_Cost',
                                          'Unit of Measure (UoM)': 'Unit_of_Measure'})

    # Cleaning dataframe
    dataframe = dataframe.dropna(subset=['Batch_Number'])

    dataframe["organization_id"] = org_id

    return dataframe.to_dict('records')


def populate_items(csv_file, collection_name, org_id):
    collection = get_collection(collection_name)
    dict_of_records = clean_data(csv_file, org_id)

    try:
        collection.insert_many(dict_of_records)
        logger.debug('Data inserted successfully')
    except pym.errors.BulkWriteError as error:
        for i in range(len(error.details["writeErrors"])):

            # If the error is different to duplicate key entry
            if error.details["writeErrors"][i]["code"] != 11000:
                logger.error("An error occured")


def update_items(csv_file, collection_name, org_id):
    collection = get_collection(collection_name)
    dict_of_records = clean_data(csv_file, org_id)


    try:
        for document in dict_of_records:
            document['organization_id'] = org_id
            item_id = f'{int(document["Batch_Number"])}_{org_id}'
            document['Item_Id'] = item_id
            document['Batch_Number'] = int(document['Batch_Number'])
            if collection.find({'Item_Id': item_id}).count():
                collection.update({'Item_Id': item_id}, document)
            else:
                collection.insert(document)
        logger.debug("Data Refreshed for organization ID: %d" , org_id)
    except pym.errors.BulkWriteError as error:
        logger.error(error)


def main(org_id, is_initializing=False):
    current_path = os.path.dirname(__file__)
    org_path = f'org_files/{org_id}.csv'
    csv = os.path.join(current_path, org_path)
    if os.path.isfile(csv):
        if is_initializing:
            populate_items(csv, "inventory_item_item", 4)
        else:
            update_items(csv, "inventory_item_item", int(org_id))
