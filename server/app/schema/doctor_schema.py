from typing import List, Optional, Union
from bson import ObjectId
from pydantic import BaseModel, Field
import pytz

from datetime import time, datetime, timedelta, date, timezone

from app.schema.contact_models import Contact
from app.schema.py_object_id import PyObjectId


class DoctorObject(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    government_id_number: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    medical_license_number: str = Field(...)
    spacialization: str = Field(...)
    contact_info: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
