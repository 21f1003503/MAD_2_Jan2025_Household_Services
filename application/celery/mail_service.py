import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from application.models import User

SMTP_SERVER = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'sajal@gmail.com'
SENDER_PASSWORD = ''

def send_email(to, subject, content):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL

    msg.attach(MIMEText(content, 'html'))

    with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()

#send_email('sp001@gmail.com', 'Test Email', '<h1>This is a test email.</h1>')