from typing import List, Optional, Union
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
import pytz

from datetime import time, datetime, timedelta, date, timezone

from app.schema.contact_models import Contact
from app.schema.location_schema import Location
from app.schema.py_object_id import PyObjectId


class Email(BaseModel):
    email: EmailStr
    verified: bool = False

    class Config:
        arbitrary_types_allowed = True
        allow_population_by_field_name = True


class PhoneNumber(BaseModel):
    phone_number: int
    country_code: int = 267
    verified: bool = False

    class Config:
        arbitrary_types_allowed = True
        allow_population_by_field_name = True


class EmergencyContact(PhoneNumber):
    name: str
    relationship: str

    class Config:
        arbitrary_types_allowed = True
        allow_population_by_field_name = True


class Contact(BaseModel):
    email: Email
    phone_number: PhoneNumber
    emergency_contact: EmergencyContact

    class Config:
        arbitrary_types_allowed = True
        allow_population_by_field_name = True


class PatientObject(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    government_id_number: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    date_of_birth: str = Field(...)
    address: Location = Field(...)
    contact_info: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PatientResponse(BaseModel):
    government_id_number: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    date_of_birth: str
    address: Location
    contact_info: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
