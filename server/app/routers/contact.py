from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId

# Initialize FastAPI router
router = APIRouter()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["doctorsdb"]
doctors_collection = db["doctors"]

# Pydantic model for Contact Information
class ContactModel(BaseModel):
    email: str
    work_number: dict
    emergency_number: dict

# Route to update a doctor's contact information
@router.put("/doctors/{doctor_id}/contact", response_model=ContactModel)
async def update_contact_info(doctor_id: str, contact: ContactModel):
    # Ensure the doctor exists
    existing_doctor = doctors_collection.find_one({"_id": ObjectId(doctor_id)})
    if existing_doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")

    updated_contact_info = {
        "contact_info.email.email": contact.email,
        "contact_info.work_number.phone_number": contact.work_number.get("phone_number"),
        "contact_info.work_number.country_code": contact.work_number.get("country_code"),
        "contact_info.emergency_number.phone_number": contact.emergency_number.get("phone_number"),
        "contact_info.emergency_number.country_code": contact.emergency_number.get("country_code"),
    }

    result = doctors_collection.update_one({"_id": ObjectId(doctor_id)}, {"$set": updated_contact_info})
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return contact

# Example ContactModel for updating contact information
example_contact = ContactModel(
    email="newemail@example.com",
    work_number={"phone_number": 1234567890, "country_code": 1},
    emergency_number={"phone_number": 9876543210, "country_code": 1},
)
