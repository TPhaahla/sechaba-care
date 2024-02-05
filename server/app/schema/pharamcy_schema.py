from typing import List, Optional, Union
from bson import ObjectId
from pydantic import BaseModel, Field
import pytz

from datetime import time, datetime, timedelta, date, timezone

from app.schema.contact_models import Contact
from app.schema.location_schema import Location
from app.schema.py_object_id import PyObjectId

class Pharmacy(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    pharmacy_name: str = Field(...)
    address: Location
    contact_information: Contact

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}