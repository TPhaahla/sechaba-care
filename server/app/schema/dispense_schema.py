from typing import List, Optional, Union
from bson import ObjectId
from pydantic import BaseModel, Field
import pytz

from datetime import time, datetime, timedelta, date, timezone
from app.schema.pharamcy_schema import Pharmacy
from app.schema.prescription_schema import DosageInstructions, MedicationPrescriptionResponse, PatientPrescriptionResponse, PrescriptionStatus
from app.schema.py_object_id import PyObjectId


class DispensePayload(BaseModel):
    medication_id: str
    dosage_instructions: DosageInstructions = Field(...)
    patient_id: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class DispenseObject(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    patient: PatientPrescriptionResponse
    dispensed_by: Pharmacy
    medication: MedicationPrescriptionResponse
    issue_date: str
    status: PrescriptionStatus

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
