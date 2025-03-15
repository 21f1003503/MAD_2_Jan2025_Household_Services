from celery import Celery
from celery.schedules import crontab
from flask import current_app as app
from application.celery.tasks import email_reminder

from application.models import *
from application.utils import roles_list

celery_app = app.extensions['celery']

pending_sp_emails = (db.session.query(User.username).join(ServiceRequestStatus, User.id == ServiceRequestStatus.spID).filter(ServiceRequestStatus.status == "PENDING").all())
emails = [email[0] for email in pending_sp_emails]

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    for email in emails:
        sender.add_periodic_task( 60, email_reminder.s(email, 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'), name=f'frequent_reminder_{email}')
        sender.add_periodic_task( crontab(hour=22, minute=0), email_reminder.s(email, 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'), name=f'reminder_{email}')
        sender.add_periodic_task( crontab(hour=22, minute=0, day_of_month=1), email_reminder.s(email, 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'), name=f'reminder_{email}')