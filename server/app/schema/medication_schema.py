from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, List

from app.schema.py_object_id import PyObjectId


class DosageForm(str, Enum):
    Tablet = "Tablet"
    Liquid = "Liquid"
    Capsule = "Capsule"
    Inhaler = "Inhaler"
    Nebulizer = "Nebulizer"
    Cream = "Cream"


class Dosage(BaseModel):
    DosageForms: List[DosageForm] = Field(
        ..., description="Forms in which the medication is available")
    DosageStrengths: List[str] = Field(
        ..., description="Strengths or concentrations of the medication")


class Medication(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    medication_name: str = Field(..., description="Name of the medication")
    active_ingredients: str = Field(...,
                                    description="Active ingredients in the medication")
    dosage: Dosage = Field(..., description="Dosage of the medication")
    manufacturer: str = Field(...,
                              description="Manufacturer of the medication")
    description: Optional[str] = Field(
        None, description="Additional description of the medication")
    requires_script: bool = Field(...,
                                  description="Does the medication require a prescription")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}


class MedicationResponse(BaseModel):
    id: str = Field(alias="_id")
    medication_name: str = Field(..., description="Name of the medication")
    active_ingredients: str = Field(...,
                                    description="Active ingredients in the medication")
    dosage: Dosage = Field(..., description="Dosage of the medication")
    manufacturer: str = Field(...,
                              description="Manufacturer of the medication")
    description: Optional[str] = Field(
        None, description="Additional description of the medication")
    requires_script: bool = Field(...,
                                  description="Does the medication require a prescription")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
