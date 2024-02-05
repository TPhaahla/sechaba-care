from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import doctor_auth, dispense, prescription, medication, patients, pharmacy_auth

app = FastAPI(
    title="Health Care Tracking Solution API for Web Application",
    description="The following documentation describes the API endpoints for the Health Care Tracking Application Web Application. These can be used by the frontend developers to build the web application with the required data.",
    version="1.0.0",
    openapi_url="/openapi.json",
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(doctor_auth.router)
app.include_router(pharmacy_auth.router)
app.include_router(medication.router)
app.include_router(patients.router)
app.include_router(prescription.router)
app.include_router(dispense.router)
# app.include_router(prescription.router)


@app.get("/")
def root():
    return {"message": "Welcome to the Health Care Tracking Solution Application."}


@app.get("/api/healthchecker")
def health_check():
    return {"message": "The API is LIVE!!"}
