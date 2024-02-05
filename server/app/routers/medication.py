from typing import List
from datetime import datetime, timedelta
from bson import ObjectId

from pydantic import BaseModel, EmailStr
from random import randbytes
import hashlib
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.auth import oauth2, utils
from app.config.config import settings

from app.schema import medication_schema
# from app.models.auth_models import register_models
# from app.models.response_models import auth as auth_response
from app.config.database import doctor_collection, medication_collection

# from app.helpers.email.email import send_mail


router = APIRouter(
    prefix='/api/medication',
    tags=['Medication']
)

AuthJWT = oauth2.AuthJWT

ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


# ADD MEDICATION
@router.post('/add', status_code=status.HTTP_201_CREATED)
async def add_medication(payload: medication_schema.Medication, request: Request):
    payload = jsonable_encoder(payload)
    # return payload
    # Check if medication already exists

    # Add the medication to the database
    new_medication = await medication_collection.insert_one(payload)
    # Get the medication from the database
    medication = await medication_collection.find_one({"_id": new_medication.inserted_id})
    # Format the medication object so as to not return sensistive data as an api response.
    medication = jsonable_encoder(medication)
    return medication

# GET MEDICATION


@router.get('/get/{medication_id}', response_model=medication_schema.MedicationResponse)
async def get_medication(medication_id: str, request: Request):
    # Find the medication in the database by its ID
    medication = await medication_collection.find_one({"_id": medication_id})
    if medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    # Format the medication object so as to not return sensitive data as an API response.
    medication = jsonable_encoder(medication)
    return medication

# GET ALL MEDICATIONS


@router.get('/get-all', response_model=List[medication_schema.MedicationResponse])
async def get_all_medications(request: Request):
    # Retrieve all medications from the database
    medications = await medication_collection.find().to_list(None)

    # Format the medication objects in the list to not return sensitive data as an API response.
    # medications = [medication_schema.Medication(
    #     **medication) for medication in medications]
    return medications

# MODIFY MEDICATION


@router.put('/update/{medication_id}', response_model=medication_schema.Medication)
async def update_medication(medication_id: str, payload: medication_schema.Medication, request: Request, user_id: str = Depends(oauth2.require_user)):
    # Find the medication in the database by its ID
    existing_medication = await medication_collection.find_one({"_id": ObjectId(medication_id)})
    if existing_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")

    # Update the medication with the new payload
    updated_medication = {**existing_medication, **payload}
    await medication_collection.update_one({"_id": ObjectId(medication_id)}, {"$set": updated_medication})

    # Get the updated medication from the database
    medication = await medication_collection.find_one({"_id": ObjectId(medication_id)})
    # Format the medication object so as to not return sensitive data as an API response.
    medication = jsonable_encoder(medication)
    return medication

# DELETE MEDICATION


@router.delete('/delete/{medication_id}', response_model=medication_schema.Medication)
async def delete_medication(medication_id: str, request: Request, user_id: str = Depends(oauth2.require_user)):
    # Find the medication in the database by its ID
    medication = await medication_collection.find_one({"_id": ObjectId(medication_id)})
    if medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")

    # Delete the medication from the database
    await medication_collection.delete_one({"_id": ObjectId(medication_id)})

    # Format the medication object so as to not return sensitive data as an API response.
    medication = jsonable_encoder(medication)
    return medication


# Create a Pydantic model for the list of medications

class MedicationList(BaseModel):
    medications: List[medication_schema.Medication]

# ADD LIST OF MEDICATIONS
# Define a route to add a list of medications


@router.post('/add-medications', status_code=status.HTTP_201_CREATED, response_model=List[medication_schema.Medication])
async def add_medications(medication_list: MedicationList, request: Request):
    medications_to_add = medication_list.medications

    # Insert each medication into the database
    inserted_medications = []
    for medication in medications_to_add:
        new_medication = await medication_collection.insert_one(jsonable_encoder(medication))
        inserted_medication = await medication_collection.find_one({"_id": new_medication.inserted_id})
        inserted_medications.append(inserted_medication)

    # Format the medication objects to not return sensitive data as an API response.
    inserted_medications = [jsonable_encoder(
        medication) for medication in inserted_medications]
    return inserted_medications
