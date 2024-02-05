from datetime import datetime, timedelta
from bson import ObjectId

from pydantic import EmailStr
from random import randbytes
import hashlib
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.auth import oauth2, utils
from app.config.config import settings

from app.schema import auth_models
# from app.models.auth_models import register_models
# from app.models.response_models import auth as auth_response
from app.config.database import doctor_collection, pharmacy_collection

# from app.helpers.email.email import send_mail


router = APIRouter(
    prefix='/api/auth/pharmacy',
    tags=['Pharmacy Authentication']
)

AuthJWT = oauth2.AuthJWT

ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


@router.post('/register', status_code=status.HTTP_201_CREATED, response_model=auth_models.RegisterPharmacyResponse)
async def register_pharmacy(payload: auth_models.RegisterPharmacy, request: Request):

    payload = jsonable_encoder(payload)
    # Check if user already exists
    existing_pharmacy = await pharmacy_collection.find_one({"contact_information.email.email": payload["contact_information"]["email"]["email"]})
    if existing_pharmacy:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Pharmacy with that email already registered.")

    # Hash the password
    payload["password"] = utils.hash(payload["password"])
    # Generate a random token
    payload["email_verification_token"] = randbytes(16).hex()
    # Add the user to the database
    new_pharmacy = await pharmacy_collection.insert_one(payload)
    # Get the user from the database
    pharmacy = await pharmacy_collection.find_one({"_id": new_pharmacy.inserted_id})
    # Format the user object so as to not return sensistive data as an api response.

    pharmacy = jsonable_encoder(pharmacy)
    return pharmacy


# @router.post('/register/pharmacy', status_code=status.HTTP_201_CREATED, response_model=auth_models.RegisterPharmacyResponse)

@router.post('/login', status_code=status.HTTP_200_OK, response_model=auth_models.LoginResponse)
async def login(payload: auth_models.LoginSchema, response: Response, Authorize: AuthJWT = Depends()):

    payload = jsonable_encoder(payload)
    # check that the user exists
    pharmacy = await pharmacy_collection.find_one({"contact_information.email.email": payload["email"]})

    if not pharmacy:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Credentials.")

    # check if password is valid
    if not utils.verify(payload["password"], pharmacy["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Credentials.")

     # Create access token
    access_token = Authorize.create_access_token(
        subject=str(pharmacy["_id"]), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN))

    # Create refresh token
    refresh_token = Authorize.create_refresh_token(
        subject=str(pharmacy["_id"]), expires_time=timedelta(minutes=REFRESH_TOKEN_EXPIRES_IN))

    # Format the user object so as to not return sensistive data as an api response.
    # user = auth_models.User(**user)
    pharmacy = jsonable_encoder(pharmacy)  # Need to ensure it's a dict
    # return user

    response = JSONResponse(content={'status': 'success', 'user': pharmacy,
                            'access_token': access_token, 'refresh_token': refresh_token})
    # Store refresh and access tokens in cookie
    response.set_cookie("access_token", access_token,
                        max_age=ACCESS_TOKEN_EXPIRES_IN * 60, path="/", httponly=True)
    response.set_cookie("refresh_token", refresh_token,
                        max_age=REFRESH_TOKEN_EXPIRES_IN * 60, path="/", httponly=True)

    return response


# @router.get('/logout', status_code=status.HTTP_200_OK, response_model=auth_models.LogoutResponse)
# def logout(response: Response, Authorize: AuthJWT = Depends(), user_id: str = Depends(oauth2.require_user)):
#     Authorize.unset_jwt_cookies()
#     response.set_cookie('logged_in', '', -1)

#     return {'status': 'success', 'message': 'Successfully LoggedOut'}


# @router.put("/update_password", status_code=status.HTTP_200_OK)
# async def change_password(payload: auth_models.PasswordChange, user_id: str = Depends(oauth2.require_user)):

#     payload = jsonable_encoder(payload)
#     # Compare Password and Password Confirm
#     if payload["new_password"] != payload["confirm_new_password"]:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST, detail='Passwords do not match.'
#         )
#     # Hash the password
#     payload["new_password"] = utils.hash(payload["new_password"])

#     updated_user = await doctor_collection.update_one({"_id": user_id}, {"$set": {"hashed_password": payload["new_password"], "updated_at": datetime.utcnow()}})
#     if updated_user.modified_count == 0:
#         raise HTTPException(
#             status_code=status.HTTP_304_NOT_MODIFIED, detail="Password not updated")
#     if updated_user.matched_count == 0:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

#     return {"status": "success", "message": "Password updated successfully."}
