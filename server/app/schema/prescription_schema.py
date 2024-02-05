from enum import Enum
from typing import List, Optional, Union
from bson import ObjectId
from pydantic import BaseModel, Field, validator
import pytz

from datetime import time, datetime, timedelta, date, timezone

from app.schema.contact_models import Contact
from app.schema.location_schema import Location
from app.schema.py_object_id import PyObjectId


class PrescriptionStatus(str, Enum):
    Pending = "Pending"
    Filled = "Filled"
    NotFilled = "Not Filled"
    Expired = "Expired"
    Cancelled = "Cancelled"


class DosageFormEnum(str, Enum):
    Tablet = "Tablet"
    Liquid = "Liquid"
    Capsule = "Capsule"
    Inhaler = "Inhaler"
    Nebulizer = "Nebulizer"
    Cream = "Cream"


class DosageFrequencyEnum(str, Enum):
    ONE_DAILY = 'Once a day'
    TWO_DAILY = 'Twice a day'
    THREE_DAILY = 'Three times a day'
    FOUR_DAILY = 'Four times a day'
    AS_NECESSARY = 'As necessary'


class DosageInstructions(BaseModel):
    DosageForm: DosageFormEnum = Field(
        ..., description="Forms in which the medication is available")
    DosageStrength: str = Field(
        ..., description="Strengths or concentrations of the medication")
    DosageFrequency: DosageFrequencyEnum = Field(
        ..., description="Frequency of the medication")
    DosageDurationDays: int = Field(
        ..., description="Duration of time for which the medication has to be taken")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class RecurringStatus(BaseModel):
    recurring: bool = False
    repetitions: int = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

    @validator("repetitions", pre=True, always=True)
    def set_repetitions_required(cls, v, values):
        if values.get("recurring", False):
            if v is None:
                raise ValueError(
                    "repetitions is required when recurring is True")
        return v


class PrescriptionObject(BaseModel):
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    patient_government_id_number: str = Field(...)
    medication_id: str = Field(...)
    # doctor_id: str = Field(...)
    dosage_instructions: DosageInstructions = Field(...)
    # issue_date: str = Field(default=str(datetime.now().date()))
    issue_date: str = Field(default=str(datetime.now().date()))
    # expiration_date: str = Field(default=str(
    #     (datetime.now() + timedelta(days=7)).date()))

    # expiration_date: datetime
    # expiration_date: str = Field(
    #     default=(str(datetime.now() + timedelta(days=7)).date()))
    status: PrescriptionStatus = 'Pending'
    pharmacy_id: Optional[str]
    recurring: RecurringStatus

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

    def parse_issue_date(self):
        return datetime.strptime(self.issue_date, "%Y-%m-%d")

    def parse_expiration_date(self):
        return datetime.strptime(self.expiration_date, "%Y-%m-%d")


class OutstandingPrescriptionObject(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    patient_id: str = Field(...)
    prescription_id: str = Field(...)
    date_of_outstanding_status: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PatientPrescriptionResponse(BaseModel):
    government_id_number: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    date_of_birth: datetime
    # address: Location
    # contact_info: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class DoctorPrescriptionResponse(BaseModel):
    government_id_number: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    medical_license_number: str = Field(...)
    specialization: str = Field(...)
    contact_info: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class MedicationPrescriptionResponse(BaseModel):
    medication_name: str = Field(...)
    active_ingredients: str = Field(...)
    manufacturer: str = Field(...)
    description: str = Field(...)
    dosage_strength: str = Field(...)
    dosage_form: str = Field(...)
    dosage_frequency: str = Field(...)
    dosage_duration_days: int = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class PrescriptionObjectResponse(BaseModel):
    patient: PatientPrescriptionResponse
    doctor: DoctorPrescriptionResponse
    medication: MedicationPrescriptionResponse
    issue_date: str
    expiration_date: str
    status: PrescriptionStatus
    # pharmacy_id: Optional[str]
    # recurring: RecurringStatus

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

    def parse_issue_date(self):
        return datetime.strptime(self.issue_date, "%Y-%m-%d")

    def parse_expiration_date(self):
        return datetime.strptime(self.expiration_date, "%Y-%m-%d")


class PrescriptionObjectInDB(PrescriptionObjectResponse):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
