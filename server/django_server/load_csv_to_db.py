import pymongo as pym
import pandas as pd


def get_collection(collection_name):
    # Making connection to mongoclient
    client = pym.MongoClient("mongodb://localhost:27017/")

    # Specifying a DB
    db = client["alta_development"]

    return db[collection_name]


def clean_data(csv_file):
    df = pd.read_csv(csv_file)

    # Renaming column to be compatible with models fields ( which doesn't contain spaces'
    df = df.rename(columns={'Batch Number': '_id', 'Part Number':'Part_Number',
                            'Part Description': 'Part_Description','Serial Number':'Serial_Number',
                            'Average Cost':'Average_Cost','Unit of Measure (UoM)':'Unit_of_Measure'})

    # Cleaning dataframe
    df = df.dropna(subset=['_id'])

    return df.to_dict('records')


def populate_items(csv_file, collection_name):
    collection = get_collection(collection_name)
    dict_of_records = clean_data(csv_file)

    try:
        collection.insert_many(dict_of_records)
        print("Data inserted successfully")
    except pym.errors.BulkWriteError as e:
        for i in range(len(e.details["writeErrors"])):

            # If the error is different to duplicate key entry
            if e.details["writeErrors"][i]["code"] != 11000:
                print("An error occured")
