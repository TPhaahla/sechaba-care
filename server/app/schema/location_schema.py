from typing import Optional
from pydantic import BaseModel


class Coordinates(BaseModel):
    longitude: float
    latitude: float

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class Location(BaseModel):
    coordinates: Optional[Coordinates]
    country: str
    city: str
    street_address: Optional[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True