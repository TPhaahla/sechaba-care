from app.config.config import settings
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, select_autoescape, PackageLoader
from fastapi import HTTPException


conf = ConnectionConfig(
    MAIL_USERNAME=settings.EMAIL_USERNAME,
    MAIL_PASSWORD=settings.EMAIL_PASSWORD,
    MAIL_FROM=settings.EMAIL_FROM,
    MAIL_PORT=settings.EMAIL_PORT,
    MAIL_SERVER=settings.EMAIL_HOST,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True

)

env = Environment(
    loader=PackageLoader('app', 'helpers/email/templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

fastmail = FastMail(conf)


async def send_mail(email, subject, name, url, template):

    template = env.get_template(f'{template}.html')

    html = template.render(
        url=url,
        first_name=name,
        subject=subject
    )

    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=html,
        subtype="html",
    )

    try:
        await fastmail.send_message(message)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Email sent successfully"}
