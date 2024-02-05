from typing import List, Optional, Union
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field

class Email(BaseModel):
    email: EmailStr
    verified: bool = False

    class Config:
        arbitrary_types_allowed = True
        allow_population_by_field_name = True

class PhoneNumber(BaseModel):
    phone_number: int
    country_code: int
    verified: bool = False

    class Config:
        arbitrary_types_allowed = True
        allow_population_by_field_name = True

class Contact(BaseModel):
    email: Email
    work_number: PhoneNumber
    emergency_number: PhoneNumber

    class Config:
        arbitrary_types_allowed = True
        allow_population_by_field_name = True