from datetime import datetime, timedelta
from typing import Annotated
from bson import ObjectId

from pydantic import EmailStr
from random import randbytes
import hashlib
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.auth import oauth2, utils
from app.config.config import settings

from app.schema import auth_models, dispense_schema, prescription_schema
# from app.models.auth_models import register_models
# from app.models.response_models import auth as auth_response
from app.config.database import doctor_collection, prescription_collection
from app.config.database import doctor_collection, pharmacy_collection, patient_collection, medication_collection, prescription_collection

# from app.helpers.email.email import send_mail


router = APIRouter(
    prefix='/api/dispense',
    tags=['Dispense Medication']
)

AuthJWT = oauth2.AuthJWT

ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


# FILL SCRIPT
@router.put('/fill-script/{script_id}')
async def fill_script(script_id: str, pharmacy_id: Annotated[str, Depends(oauth2.require_pharmacy_user)]):

    # Check if script exists
    prescription = await prescription_collection.find_one({'_id': script_id})
    if prescription is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Prescription Not Found')

# Convert date strings to datetime objects
    issue_date = datetime.strptime(prescription.get(
        'issue_date')[:10], "%Y-%m-%d") if prescription.get('issue_date') else None

    # Check if issue date is not in the future
    # issue_date = prescription.get('issue_date')
    if issue_date and issue_date > datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Prescription Issue Date is in the future')

    # Check if prescription status is not 'filled' or 'cancelled'
    status_value = prescription.get('status')
    if status_value in ['Filled', 'Cancelled']:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f'Prescription is already {status_value}')

    # Check if no other script with issue date less than 'dosage_duration_days' in the past
    # with the same 'active_ingredients' value
    active_ingredients = prescription.get(
        'medication', {}).get('active_ingredients')
    if active_ingredients:
        past_date_limit = datetime.utcnow() - timedelta(days=prescription.get('medication',
                                                                              {}).get('dosage_duration_days', 0))
        existing_script = await prescription_collection.find_one({
            '_id': {'$ne': ObjectId(script_id)},
            'issue_date': {'$gte': past_date_limit},
            'medication.active_ingredients': active_ingredients,
            'status': {'$nin': ['Filled', 'Cancelled']}
        })
        if existing_script:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                detail=f'Another prescription with the same active ingredients issued within the specified duration exists')

    # Assuming you have a collection named `script_collection` to store filled scripts
    filled_script = {
        'filled_date': datetime.utcnow(),
        'filled_by_pharmacy_id': pharmacy_id
    }

    updated_script = await prescription_collection.update_one({'_id': script_id}, {'$set': {'status': 'Filled', 'pharmacy': pharmacy_id}})

    if updated_script.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Prescription not found")

    if updated_script.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED,
                            detail="Prescription data not updated")

    if (script := await prescription_collection.find_one({'_id': script_id})):
        script = jsonable_encoder(script)
        return script
    # Save the filled script to the database
    # await script_collection.insert_one(filled_script)

    # Update the prescription status to 'filled'
    # await prescription_collection.update_one({'_id': ObjectId(script_id)}, {'$set': {'status': 'filled'}})

    # return {'message': 'Prescription filled successfully'}


# DISPENSE MEDICATION
@router.post('/')
async def dispense_medication(payload: dispense_schema.DispensePayload, pharmacy_id: Annotated[str, Depends(oauth2.require_pharmacy_user)]):

    payload = jsonable_encoder(payload)

    # Get Pharmacy Details
    pharmacy = await pharmacy_collection.find_one({'_id': pharmacy_id})
    pharmacy = jsonable_encoder(pharmacy)
    # Check if medication exists
    medication = await medication_collection.find_one({'_id': payload['medication_id']})
    if medication is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Medication not found.")
    # check Medication Dosage Instructions Valid
    dosage_instructions = payload['dosage_instructions']
    dosage_form = dosage_instructions['DosageForm']
    dosage_strength = dosage_instructions['DosageStrength']
    dosage_frequency = dosage_instructions['DosageFrequency']
    dosage_duration_days = dosage_instructions['DosageDurationDays']

    if dosage_form not in medication['dosage']['DosageForms']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Invalid dosage form.")
    if dosage_strength not in medication['dosage']['DosageStrengths']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Invalid dosage strength.")

# Check that medication does not require a script
    if (medication['requires_script']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Medication requires a script, please locate the script and try again.")
    medication = prescription_schema.MedicationPrescriptionResponse(
        **medication, dosage_form=dosage_form, dosage_strength=dosage_strength, dosage_frequency=dosage_frequency, dosage_duration_days=dosage_duration_days)

    # Check if the patient exists
    patient = await patient_collection.find_one({'government_id_number': payload['patient_id']})
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patient not found.")

    patient = prescription_schema.PatientPrescriptionResponse(**patient)

    # Create Dispense Object
    dispense_object = dispense_schema.DispenseObject(
        patient=patient, dispensed_by=pharmacy, medication=medication, issue_date=str(datetime.utcnow()), status='Filled')

    return dispense_object
    # Create a new dispense object with status 'Filled'
    raise HTTPException(status_code=501, detail="Not Implemented")


# CANCEL DISPENSE
@router.put('/cancel/{dispense_id}')
async def cancel_dispense(dispense_id: str, pharmacy_id: Annotated[str, Depends(oauth2.require_pharmacy_user)]):
    # Check if dispense object exists
    # Set status to 'Cancelled'
    raise HTTPException(status_code=501, detail="Not Implemented")


# GET DISPENSED MEDICATIONS
@router.get('/get-all')
async def get_dispensed_medication(pharmacy_id: Annotated[str, Depends(oauth2.require_pharmacy_user)]):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED,
                        detail='Function not implemented yet')
