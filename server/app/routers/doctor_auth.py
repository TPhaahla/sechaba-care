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
from app.helpers.email.email import send_mail

from app.schema import auth_models
# from app.models.auth_models import register_models
# from app.models.response_models import auth as auth_response
from app.config.database import doctor_collection

# from app.helpers.email.email import send_mail


router = APIRouter(
    prefix='/api/auth/doctor',
    tags=['Authentication']
)

AuthJWT = oauth2.AuthJWT

ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


@router.post('/register', status_code=status.HTTP_201_CREATED, response_model=auth_models.RegisterDoctorResponse)
async def register_doctor(payload: auth_models.RegisterDoctor, request: Request):

    payload = jsonable_encoder(payload)
    # Check if user already exists
    doctor = await doctor_collection.find_one({"contact_info.email.email": payload["contact_info"]["email"]["email"]})
    if doctor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="User with that email already exists")

    # Hash the password
    payload["password"] = utils.hash(payload["password"])

    # try:

#         token = randbytes(10)
#         hashedCode = hashlib.sha256()
#         hashedCode.update(token)
#         verification_code = hashedCode.hexdigest()
#         update_result = await users_collection.update_one({"_id":new_user.inserted_id}, {"$set": {"contact_info.email_addresses.$[email].verification_code":verification_code, "updated_at":datetime.utcnow()}},
#                                                           array_filters=[{"email.email":payload["email"].lower()}])
#         url = f"{request.url.scheme}://{request.client.host}:{request.url.port}/api/auth/verifyemail/{token.hex()}"

#         await send_mail(payload["email"], "Verification Test", created_user["name"], url, 'verification')
#         user_object = auth_models.CreatedUserResponse(**user.dict(), profile_type=default_profile, status="success", message="Profile Created Successfully. A Verification email has been sent to your email address.")
#         return user_object

#     except Exception as e:

#         await users_collection.delete_one({"_id":new_user.inserted_id})
#         e = jsonable_encoder(e)
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail = "There was an error creating your account. Please Try again later")
    # Add the user to the database
    new_user = await doctor_collection.insert_one(payload)
    # Get the user from the database

    # Create Verification Code To Send By Email
    try:
        token = randbytes(10)
        hashedCode = hashlib.sha256()
        hashedCode.update(token)
        verification_code = hashedCode.hexdigest()
        update_result = await doctor_collection.update_one({"_id": new_user.inserted_id}, {"$set": {"contact_info.email.verification_code": verification_code, "updated_at": datetime.utcnow()}})
        url = f"{request.url.scheme}://{request.client.host}:{request.url.port}/api/auth/doctor/verify-email/{token.hex()}"

        await send_mail(payload["contact_info"]["email"]["email"], "Verification Test", payload["first_name"], url, 'verification')
        # Format the user object so as to not return sensistive data as an api response.
        user = await doctor_collection.find_one({"_id": new_user.inserted_id})
        user = jsonable_encoder(user)
        return user
        # return {"status": "success", "message": "Profile Created Successfully. A Verification email has been sent to your email address."}
    except Exception as e:
        await doctor_collection.delete_one({"_id": new_user.inserted_id})
        e = jsonable_encoder(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="There was an error creating your account. Please Try again later")


# @router.post('/register/pharmacy', status_code=status.HTTP_201_CREATED, response_model=auth_models.RegisterPharmacyResponse)

@router.post('/login', status_code=status.HTTP_200_OK, response_model=auth_models.LoginResponse)
async def login(payload: auth_models.LoginSchema, response: Response, Authorize: AuthJWT = Depends()):

    payload = jsonable_encoder(payload)
    # check that the user exists
    doctor = await doctor_collection.find_one({"contact_info.email.email": payload["email"]})

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Credentials")

    # check if password is valid
    if not utils.verify(payload["password"], doctor["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Credentials.")

     # Create access token
    access_token = Authorize.create_access_token(
        subject=str(doctor["_id"]), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN))

    # Create refresh token
    refresh_token = Authorize.create_refresh_token(
        subject=str(doctor["_id"]), expires_time=timedelta(minutes=REFRESH_TOKEN_EXPIRES_IN))

    # Format the user object so as to not return sensistive data as an api response.
    # user = auth_models.User(**user)
    doctor = jsonable_encoder(doctor)  # Need to ensure it's a dict
    # return user

    response = JSONResponse(content={'status': 'success', 'user': doctor,
                            'access_token': access_token, 'refresh_token': refresh_token})
    # Store refresh and access tokens in cookie
    response.set_cookie("access_token", access_token,
                        max_age=ACCESS_TOKEN_EXPIRES_IN * 60, path="/", httponly=True)
    response.set_cookie("refresh_token", refresh_token,
                        max_age=REFRESH_TOKEN_EXPIRES_IN * 60, path="/", httponly=True)

    return response


@router.get('/logout', status_code=status.HTTP_200_OK, response_model=auth_models.LogoutResponse)
def logout(response: Response, Authorize: AuthJWT = Depends(), user_id: str = Depends(oauth2.require_user)):
    Authorize.unset_jwt_cookies()
    response.set_cookie('logged_in', '', -1)

    return {'status': 'success', 'message': 'Successfully LoggedOut'}


@router.put("/update_password", status_code=status.HTTP_200_OK)
async def change_password(payload: auth_models.PasswordChange, user_id: str = Depends(oauth2.require_user)):

    payload = jsonable_encoder(payload)
    # Compare Password and Password Confirm
    if payload["new_password"] != payload["confirm_new_password"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Passwords do not match.'
        )
    # Hash the password
    payload["new_password"] = utils.hash(payload["new_password"])

    updated_user = await doctor_collection.update_one({"_id": user_id}, {"$set": {"hashed_password": payload["new_password"], "updated_at": datetime.utcnow()}})
    if updated_user.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED, detail="Password not updated")
    if updated_user.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return {"status": "success", "message": "Password updated successfully."}


# @router.get('/new_verification_code/{email}')
# async def get_new_verification_code(email: str, request: Request):

#     user = await users_collection.find_one({'contact_info.email_addresses.email': email})
#     user = jsonable_encoder(user)
#     # return user
#     # print(user)
#     try:
#         token = randbytes(10)
#         hashedCode = hashlib.sha256()
#         hashedCode.update(token)
#         verification_code = hashedCode.hexdigest()
#         # update_result = await users_collection.update_one({"primary_email":email}, {"$set": {"verification_code":verification_code, "updated_at":datetime.utcnow()}})
#         update_result = await users_collection.update_one({"_id": user['_id']}, {"$set": {"contact_info.email_addresses.$[email].verification_code": verification_code, "updated_at": datetime.utcnow()}},
#                                                           array_filters=[{"email.email": email}])

#         url = f"{request.url.scheme}://{request.client.host}:{request.url.port}/api/auth/verifyemail/{token.hex()}"
#         # print(url)
#         await send_mail(email, "Verification Test", user["name"], url, 'verification')

#     except Exception as e:

#         await users_collection.update_one({"_id": user['_id']}, {"$set": {"contact_info.email_addresses.$[email].verification_code": None, "updated_at": datetime.utcnow()}},
#                                           array_filters=[{"email.email": email}])
#         e = jsonable_encoder(e)
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                             detail="There was an error sending the email, please try again.")

#     # , 'link':url}
#     return {'status': 'success', 'message': 'Verification code has been sent to your email'}


@router.get('/verify-email/{token}')
async def verify_me(token: str):
    hashedCode = hashlib.sha256()
    hashedCode.update(bytes.fromhex(token))
    verification_code = hashedCode.hexdigest()
    result = await doctor_collection.update_one({"contact_info.email.verification_code": verification_code}, {
        "$set": {"contact_info.email.verification_code": None, "contact_info.email.verified": True, "updated_at": datetime.utcnow()}})
    # result = await users_collection.find_one({"contact_info.email_addresses.$.verification_code":verification_code})
    # return result
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Invalid verification code or account already verified')
    return {
        "status": "success",
        "message": "Account verified successfully"
    }
