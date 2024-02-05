from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):

    # DB SETTINGS
    DB_URL: str
    DB_NAME: str

    # JWT/AUTH SETTINGS
    JWT_ALGORITHM: str
    JWT_PRIVATE_KEY: str
    JWT_PUBLIC_KEY: str

    # ACCESS TOKEN PARAMETERS
    ACCESS_TOKEN_EXPIRES_IN: int
    REFRESH_TOKEN_EXPIRES_IN: int

    # EMAIL SETTINGS
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: EmailStr

    class Config:
        env_file = ".env"


settings = Settings()
