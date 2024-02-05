from typing import List
from datetime import datetime
from bson import ObjectId

from pydantic import BaseModel, EmailStr
from random import randbytes
import hashlib
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.auth import oauth2, utils
from app.config.config import settings

from app.schema import patient_schema
# from app.models.auth_models import register_models
# from app.models.response_models import auth as auth_response
from app.config.database import doctor_collection, medication_collection, patient_collection

# from app.helpers.email.email import send_mail


router = APIRouter(
    prefix='/api/patients',
    tags=['Patients']
)

AuthJWT = oauth2.AuthJWT

ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


# ADD NEW PATIENT
@router.post('/add', status_code=status.HTTP_201_CREATED, response_model=patient_schema.PatientResponse)
async def add_patient(payload: patient_schema.PatientObject, request: Request):
    payload = jsonable_encoder(payload)
    # return payload
    # Check if patient already exists
    payload['government_id_number'] = payload['government_id_number'].upper()
    patient = await patient_collection.find_one({"government_id_number": payload["government_id_number"]})
    if patient:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Patient profile already exists. Import patient data from the database.")

    # Add the patient to the database
    new_patient = await patient_collection.insert_one(payload)
    # Get the patient from the database
    patient = await patient_collection.find_one({"_id": new_patient.inserted_id})
    # Format the patient object so as to not return sensistive data as an api response.
    patient = jsonable_encoder(patient)
    return patient

# GET PATIENT DATA


@router.get('/get/{patient_gov_id}', response_model=patient_schema.PatientResponse)
async def get_patient(patient_gov_id: str, request: Request):
    # Find the patient in the database by its ID
    patient = await patient_collection.find_one({"government_id_number": patient_gov_id})
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    # Format the patient object so as to not return sensitive data as an API response.
    patient = jsonable_encoder(patient)
    return patient

# # GET ALL MY PATIENTS
# @router.get('/get-all', response_model=List[patient_schema.PatientResponse])

# GET LIST OF PATIENTS


@router.get('/get-all', response_model=List[patient_schema.PatientResponse])
async def get_all_patients(request: Request):
    patients = await patient_collection.find().to_list(None)

    return patients
