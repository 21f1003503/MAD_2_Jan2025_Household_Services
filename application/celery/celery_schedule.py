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
    # every 10 seconds
    # sender.add_periodic_task(20.0, email_reminder.s('customer02@gmail.com', 'Reminder to login', '<h2>Hey Customer!!</h2><h4>Did you login today yet?</h4>'))

    # daily message at 01:36,daily
    #sender.add_periodic_task(crontab(hour=1, minute=36), email_reminder.s('customer02@gmail.com', 'Reminder to login', '<h2>Hey Customer!!</h2><h4>Did you login today yet?</h4>'), name = 'daily_reminder')
    #sender.add_periodic_task(crontab(hour=1, minute=40, day_of_week='saturday'), email_reminder.s('customer02@gmail.com', 'Reminder to login', '<h2>Hey Customer!!</h2><h4>Did you login today yet?</h4>'), name = 'weekly_reminder')
    # sender.add_periodic_task(15.0, email_reminder.s(sp[0], 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'))

    # for sp in pending_sp_usernames:
    #     print('sp:', sp)
    #     sender.add_periodic_task(15.0, email_reminder.s(sp[0], 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'))
    #     sender.add_periodic_task(crontab(hour=21, minute=46), email_reminder).s(sp[0], 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!', name='sp_daily_reminder')

    # for sp in pending_sp_usernames:
    #     print('sp:', sp[0])  # For debugging
    #     sender.add_periodic_task(crontab(hour=21, minute=49), email_reminder.s(sp[0], 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'),name=f'sp_daily_reminder_{sp[0]}')

    for email in emails:
        sender.add_periodic_task( 60, email_reminder.s(email, 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'), name=f'frequent_reminder_{email}')
        sender.add_periodic_task( crontab(hour=22, minute=0), email_reminder.s(email, 'Reminder To Check Pending Requests', 'Hey Service Professional, You have pending service requests! Respond to them soon!!!'), name=f'reminder_{email}')