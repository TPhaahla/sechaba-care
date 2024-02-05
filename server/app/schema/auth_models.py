from pydantic import BaseModel, Field, EmailStr, constr, validator
from typing import List, Optional, Union
from bson import ObjectId
from datetime import time, datetime, timedelta, date

from app.schema.contact_models import Contact
from app.schema.location_schema import Location


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class RegisterDoctorResponse(BaseModel):
    government_id_number: str
    first_name: str
    last_name: str
    medical_license_number: str = Field(...)
    specialization: str = Field(...)
    contact_info: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class RegisterDoctor(RegisterDoctorResponse):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    password: str
    confirm_password: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class RegisterPharmacyResponse(BaseModel):
    pharmacy_name: str
    address: Location
    contact_information: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class RegisterPharmacy(RegisterPharmacyResponse):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    password: str
    confirm_password: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class LoginSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class LoginResponse(BaseModel):
    status: str
    access_token: str
    refresh_token: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class LogoutResponse(BaseModel):
    status: str
    message: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class PasswordChange(BaseModel):
    new_password: str
    confirm_new_password: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
