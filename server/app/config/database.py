import motor.motor_asyncio
import certifi
from .config import settings
from pymongo.server_api import ServerApi
# Import the ConfigurationError exception
from pymongo.errors import ConfigurationError


ca = certifi.where()
db_url = settings.DB_URL
db_name = settings.DB_NAME

client = None
database = None
doctor_collection = None
prescription_collection = None
pharmacy_collection = None
patient_collection = None
medication_collection = None
transactions_collection = None
# print(db_name)


def connect_to_database():
    global client, database, doctor_collection, prescription_collection, pharmacy_collection, patient_collection, medication_collection, transactions_collection
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(
            db_url, tlsCAFile=ca, server_api=ServerApi('1')
        )
        database = client[db_name]

        doctor_collection = database["doctors"]
        prescription_collection = database["prescriptions"]
        pharmacy_collection = database["pharmacies"]
        patient_collection = database["patients"]
        medication_collection = database["medications"]
        transactions_collection = database["transactions"]
        print('db_connected')
    except ConfigurationError as exc:
        # Handle ConfigurationError here
        # raise ConfigurationError(str(exc))  # Re-raise the exception with a custom message
        print("An error occurred:", str(exc))


async def close_database_connection():
    client.close()


# THIS IS INCLUDED HERE BECAUSE OF THE WAY THE CODE IS SETUP.
# WHEN THE APP INISTIALISES THE COLLECTION VARIABLES ARE ASSIGNED BEOFRE THE @app.on_event('startup) runs
# because it's imported in the classes that are included with app.include_router()
connect_to_database()
