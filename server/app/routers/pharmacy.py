from typing import List
from datetime import datetime
from bson import ObjectId

from pydantic import BaseModel, EmailStr
from random import randbytes
import hashlib
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.auth import oauth2, utils
from app.config.config import settings

from app.schema import patient_schema
# from app.models.auth_models import register_models
# from app.models.response_models import auth as auth_response
from app.config.database import doctor_collection, medication_collection, patient_collection

# from app.helpers.email.email import send_mail


router = APIRouter(
    prefix='/api/pharmacy',
    tags=['Pharmacys']
)

AuthJWT = oauth2.AuthJWT

ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


# @router.get('/')
