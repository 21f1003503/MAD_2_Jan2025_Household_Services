from celery import shared_task
from .models import *
from .mail import send_email
import csv
import datetime
from .utils import format_report
import requests

# user triggered job
@shared_task(ignore_results = False, name = 'download_csv_report')
def csv_report():
    users = User.query.all()
    service_reqs = Service__Request.query.all()
    csv_file_name = f'service_request_data_{datetime.datetime.now().strftime("%f")}.csv'
    with open(f'static/{csv_file_name}', 'w', newline="") as csvfile:
        sr_no = 1
        serv_req_csv = csv.writer(csvfile, delimiter=',')
        serv_req_csv.writerow(['Sr No','Request ID', 'Service Name', 'Customer Name', 'Service Professional Name', 'Date Of Request', 'Date Of Completion', 'Status', 'Remarks', 'Rating', 'Amount'])
        for sr in service_reqs:
            this_sr = [sr_no, sr.s_reqID, sr.service.service_name, sr.customer.full_name, sr.service_professional.full_name if sr.service_professional else "Yet to be Allotted", sr.date_of_req, sr.date_of_completion, sr.service_status, sr.remarks if sr.remarks else "N/A", sr.rating if sr.rating else "N/A", sr.service.service_price]
            serv_req_csv.writerow(this_sr)
            sr_no += 1

    return csv_file_name

# scheduled task
@shared_task(ignore_results = False, name = 'monthly_report')
def monthly_report():
    customers = User.query.join(UsersRoles).join(Role).filter(Role.name == "customer").all()
    
    for cus in customers[1:]:
        customer_data = {}
        customer_data['full_name'] = cus.full_name
        customer_data['username'] = cus.username
        cus_serv_reqs = []
        for service_req in cus.serv_reqs:
            this_serv_req = {}
            this_serv_req["s_reqID"] = service_req.s_reqID
            this_serv_req["service_professional"] = service_req.service_professional.full_name if service_req.spID else "Yet To Be Assigned"
            this_serv_req["service_status"] = service_req.service_status
            this_serv_req["date_of_request"] = service_req.date_of_req
            this_serv_req["date_of_completion"] = service_req.date_of_completion
            this_serv_req["remarks"] = service_req.remarks if service_req.remarks else "N/A"
            this_serv_req["rating"] = service_req.rating if service_req.rating else "N/A"
            this_serv_req["service_name"] = service_req.service.service_name
            this_serv_req["service_price"] = service_req.service.service_price
            cus_serv_reqs.append(this_serv_req)
        customer_data['service_requests'] = cus_serv_reqs

        message = format_report('templates/customer_activity_report.html', data=customer_data)
        send_email(customer_data['username'], subject="Monthly Activity Report - FixItNow!", message=message)

    return "Monthly reports sent"

@shared_task(ignore_results = False, name = 'daily_reminders')
def daily_reminders():
    allSPs = User.query.join(ServiceRequestStatus, User.id == ServiceRequestStatus.spID).filter(ServiceRequestStatus.status == 'PENDING').all()
    sp_json = []

    for sp in allSPs:
        this_sp = {
            "username": sp.username,
            "full_name": sp.full_name,
        }
        sp_json.append(this_sp)

    if allSPs:
        for sp in allSPs:
            message = format_report('templates/sp_daily_reminder.html', data=sp_json)
            send_email(sp.username, subject="Service Professional Daily Reminder - FixItNow!", message=message)


# activity triggered task (Async)
@shared_task(ignore_results = False, name = 'service_request_status_update')
def service_req_update(username, s_name, s_reqID, task_id):
    if task_id == 1:
        text = f"Hi {username}, your {s_name} Service Request's (Request ID: {s_reqID}) status has been updated. Kindly check at http://127.0.0.1:5000"
        response = requests.post("https://chat.googleapis.com/v1/spaces/AAAAmJYHkbw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=02Y3pzsZ1UXKYB0cn9m9Sw-py2dAG8OhO-aB_r-FmDU", headers={'Content-Type': 'application/json'}, json = {"text": text})
        return "Service Request is created and the user is notified."
    elif task_id == 0:
        text = f"Hi {username}!, you have created a new {s_name} Service Request (Request ID: {s_reqID}). Kindly visit http://127.0.0.1:5000 for more info." 
        response = requests.post("https://chat.googleapis.com/v1/spaces/AAAAmJYHkbw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=02Y3pzsZ1UXKYB0cn9m9Sw-py2dAG8OhO-aB_r-FmDU", headers={'Content-Type': 'application/json'}, json = {"text": text})
        return "Service Request Status is updated and the user is updated."
    elif task_id == 2:
        text = f"Hi {username}!, your {s_name} Service Request (Request ID: {s_reqID}) has been closed. Kindly visit http://127.0.0.1:5000 for more info. \n\nHope to see you soon!" 
        response = requests.post("https://chat.googleapis.com/v1/spaces/AAAAmJYHkbw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=02Y3pzsZ1UXKYB0cn9m9Sw-py2dAG8OhO-aB_r-FmDU", headers={'Content-Type': 'application/json'}, json = {"text": text})
        return "Service Request is closed and the user is notified."
    elif task_id == 3:
        text = f"Hi {username}!, your {s_name} Service Request (Request ID: {s_reqID}) has been deleted. Kindly visit http://127.0.0.1:5000 for more info." 
        response = requests.post("https://chat.googleapis.com/v1/spaces/AAAAmJYHkbw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=02Y3pzsZ1UXKYB0cn9m9Sw-py2dAG8OhO-aB_r-FmDU", headers={'Content-Type': 'application/json'}, json = {"text": text})
        return "Service Request is deleted and the user is notified."
