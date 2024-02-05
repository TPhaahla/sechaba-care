from datetime import datetime
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

from app.schema import auth_models, prescription_schema
# from app.models.auth_models import register_models
# from app.models.response_models import auth as auth_response
from app.config.database import doctor_collection, patient_collection, medication_collection, prescription_collection

# from app.helpers.email.email import send_mail


router = APIRouter(
    prefix='/api/prescription',
    tags=['Prescription Handling']
)

AuthJWT = oauth2.AuthJWT

ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


async def check_prescription_is_valid(new_prescription):
    # Check if a prescription with the same active ingredient exists
    existing_prescription = await prescription_collection.find_one({
        "medication.active_ingredients": new_prescription["medication"]["active_ingredients"],
        "status": "Filled"
    })

    if existing_prescription:
        existing_issue_date = datetime.fromisoformat(
            existing_prescription["issue_date"])
        existing_duration = timedelta(
            days=existing_prescription["medication"]["dosage_duration_days"])
        existing_expiration_date = existing_issue_date + existing_duration

        new_issue_date = datetime.fromisoformat(new_prescription["issue_date"])
        new_expiration_date = new_issue_date + \
            timedelta(
                days=new_prescription["medication"]["dosage_duration_days"])
        # print(new_prescription)
        # print(new_issue_date.date(), existing_expiration_date.date())
        if new_issue_date.date() < existing_expiration_date.date():
            return {
                'valid': False,
                'message': "Prescription overlaps with existing prescription."
            }

    return {
        'valid': True,
        'message': "Prescription is valid."
    }


def check_date_overlap_with_collection(current_object, collection):
    for other_object in collection:
        # Skip comparing the object with itself
        if current_object['_id'] != other_object['_id']:
            if check_date_overlap(current_object, other_object):
                return True  # Overlapping dates found
    return False  # No overlapping dates found


def check_date_overlap(doc1, doc2):
    # Extract relevant information
    med1 = doc1['medication']['active_ingredients']
    med2 = doc2['medication']['active_ingredients']
    doc1['issue_date'] = doc1['issue_date'][:10]
    doc2['issue_date'] = doc2['issue_date'][:10]
    issue_date1 = datetime.strptime(doc1['issue_date'], '%Y-%m-%d')
    expiration_date1 = datetime.strptime(doc1['expiration_date'], '%Y-%m-%d')
    issue_date2 = datetime.strptime(doc2['issue_date'], '%Y-%m-%d')
    expiration_date2 = datetime.strptime(doc2['expiration_date'], '%Y-%m-%d')

    # Check if medications are the same
    if med1 == med2:
        # Check for date overlap
        if (issue_date1 <= expiration_date2) and (issue_date2 <= expiration_date1):
            return True  # Overlapping dates
        else:
            return False  # Non-overlapping dates
    else:
        return False  # Medications are different


@router.post('/issue', status_code=status.HTTP_200_OK)
async def issue_prescription(payload: prescription_schema.PrescriptionObject, doctor_id: Annotated[str, Depends(oauth2.require_user)]):
    # return payload
    payload = jsonable_encoder(payload)
    # Check if the patient exists
    patient = await patient_collection.find_one({'government_id_number': payload['patient_government_id_number']})
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patient not found.")

    patient = prescription_schema.PatientPrescriptionResponse(**patient)

    # assign doctor details if the doctor exists
    doctor = await doctor_collection.find_one({'_id': doctor_id})
    doctor = prescription_schema.DoctorPrescriptionResponse(**doctor)
    # return doctor

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
    # return medication
    # Check medication active ingredient

    # Calculate if this script overlaps with any other scripts by comparing the active ingredients in previous scripts along with whether the script is pending, filled, expired or cancelled.

    # Return the script details in full, and not as id references.
    medication = prescription_schema.MedicationPrescriptionResponse(
        **medication, dosage_form=dosage_form, dosage_strength=dosage_strength, dosage_frequency=dosage_frequency, dosage_duration_days=dosage_duration_days)
    prescription_object = prescription_schema.PrescriptionObjectResponse(
        patient=patient, doctor=doctor, medication=medication, **payload, expiration_date=(datetime.fromisoformat(payload['issue_date']) + timedelta(days=dosage_duration_days)).date().isoformat())

    prescription_object = jsonable_encoder(prescription_object)
    prescription_valid = await check_prescription_is_valid(prescription_object)
    if not prescription_valid['valid']:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=prescription_valid['message'])

    prescriptions = []

    # prescriptions.append(prescription_object)
    # return prescriptions
    # If script is recurring, create duplicated post-dated scripts
    script_dosage_duration_days = prescription_object['medication']['dosage_duration_days']
    if payload['recurring']['recurring']:
        number_of_repeats = payload['recurring']['repetitions']
        for i in range(number_of_repeats):
            # print(f'i = {i}')

            # Handle Initial Case
            if i == 0:
                prescription_object_to_insert = prescription_schema.PrescriptionObjectInDB(
                    **prescription_object)
                prescriptions.append(jsonable_encoder(
                    prescription_object_to_insert))
                continue
            # print('=======================')
            prescription_object['issue_date'] = (datetime.fromisoformat(
                prescription_object['issue_date']) + timedelta(days=script_dosage_duration_days)).date().isoformat()

            # print(f'Issue Date: {prescription_object["issue_date"]}')
            prescription_object['expiration_date'] = (datetime.fromisoformat(
                prescription_object['issue_date']) + timedelta(days=(prescription_object['medication']['dosage_duration_days']))).date().isoformat()

            # print(prescription_object['issue_date'] +
            #       '\t' + prescription_object['expiration_date'])
            # print('=======================')

            prescription_object_to_insert = prescription_schema.PrescriptionObjectInDB(
                **prescription_object)
            prescriptions.append(jsonable_encoder(
                prescription_object_to_insert))

    else:
        # If script is not recurring, create a single script
        prescription_object_to_insert = prescription_schema.PrescriptionObjectInDB(
            **prescription_object)
        prescription_object_to_insert = jsonable_encoder(
            prescription_object_to_insert)
        prescriptions.append(prescription_object_to_insert)
    # return prescriptions[0]
    # ADD PRESCRIPTIONS TO DB
    scripts = await prescription_collection.find().to_list(length=None)
    check_date_overlap_with_collection(prescriptions[0], scripts)
    if len(prescriptions) > 1:
        new_prescriptions = await prescription_collection.insert_many(
            prescriptions)
    else:
        new_prescriptions = await prescription_collection.insert_one(prescriptions[0])
    return prescriptions

    # raise HTTPException(
    #     status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.put('/cancel/{prescription_id}', status_code=status.HTTP_200_OK)
async def cancel_prescription(prescription_id: str):

    # Check if the prescription exists

    # Check if the prescription is pending or filled

    # Cancel the prescription

    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")

# GET PRESCRIPTION BY ID


# , response_model=prescription_schema.PrescriptionObjectResponse)
@router.get('/get/presc-id/{prescription_id}', status_code=status.HTTP_200_OK)
async def get_prescription_by_id(prescription_id: str):

    # Check if the prescription exists
    prescription = await prescription_collection.find_one({'_id': prescription_id})
    if prescription is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Prescription not found.")

    # Return the prescription
    else:
        return prescription

    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")

# GET PRESCRIPTIONS OF PATIENT BY PATIENT GOVERNMENT ID NUMBER


@router.get('/get/{patient_gov_id}', status_code=status.HTTP_200_OK)
async def get_prescriptions(patient_gov_id: str):

    # Check if the patient exists
    patient = await patient_collection.find_one({'government_id_number': patient_gov_id})
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patient not found.")

    # Get the prescriptions of the patient
    prescriptions = await prescription_collection.find({'patient.government_id_number': patient_gov_id}).to_list(length=None)
    # Return the prescriptions
    return prescriptions


# GET ALL PRESCRIPTIONS OF DOCTOR


@router.get('/get-patients/', status_code=status.HTTP_200_OK)
async def get_patients(doctor_id: Annotated[str, Depends(oauth2.require_user)]):
    # Check if the doctor exists
    doctor = await doctor_collection.find_one({'_id': doctor_id})
    if doctor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Doctor not found.")

    # Get the prescriptions issued by this doctor
    doctor = jsonable_encoder(doctor)
    prescriptions = await prescription_collection.find({'doctor.government_id_number': doctor['government_id_number']}).to_list(length=None)
    if prescriptions is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Prescriptions not found.")

    # Return the prescriptions
    return prescriptions

    # raise HTTPException(
    #     status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
