from celery import Celery
from celery.schedules import crontab
from flask import current_app as app
from application.celery.tasks import email_reminder

celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # every 10 seconds
    #sender.add_periodic_task(10.0, email_reminder.s('customer02@gmail.com', 'Reminder to login', '<h2>Hey Customer!!</h2><h4>Did you login today yet?</h4>'))

    # daily message at 01:36,daily
    sender.add_periodic_task(crontab(hour=1, minute=36), email_reminder.s('customer02@gmail.com', 'Reminder to login', '<h2>Hey Customer!!</h2><h4>Did you login today yet?</h4>'), name = 'daily_reminder')

    sender.add_periodic_task(crontab(hour=1, minute=40, day_of_week='saturday'), email_reminder.s('customer02@gmail.com', 'Reminder to login', '<h2>Hey Customer!!</h2><h4>Did you login today yet?</h4>'), name = 'weekly_reminder')

