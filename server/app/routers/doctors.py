# from fastapi import APIRouter, HTTPException
# from fastapi.encoders import jsonable_encoder
# from pydantic import BaseModel
# from pymongo import MongoClient
# from bson import ObjectId

# # Initialize FastAPI app
# router = APIRouter()


# # Retrieve a doctor's profile from MongoDB
# @router.get("/doctors/{doctor_id}", response_model=DoctorModel)
# async def get_doctor(doctor_id: str):
#     doctor = doctor_collection.find_one({"_id": ObjectId(doctor_id)})
#     if doctor is None:
#         raise HTTPException(status_code=404, detail="Doctor not found")
#     return {**doctor, "id": doctor_id}

# # Update a doctor's profile in MongoDB
# @router.put("/doctors/{doctor_id}", response_model=DoctorModel)
# async def update_doctor(doctor_id: str, doctor: DoctorModel):
#     updated_doctor = {
#         "first_name": doctor.first_name,
#         "last_name": doctor.last_name,
#         "medical_license_number": doctor.medical_license_number,
#         "specialization": doctor.specialization,
#     }
#     result = doctors_collection.update_one({"_id": ObjectId(doctor_id)}, {"$set": updated_doctor})
#     if result.modified_count == 0:
#         raise HTTPException(status_code=404, detail="Doctor not found")
#     return {**doctor.dict(), "id": doctor_id}
