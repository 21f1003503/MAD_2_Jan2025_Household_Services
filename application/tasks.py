from celery import shared_task
from .models import *
import csv
import datetime

# user triggered job
@shared_task(ignore_results = False, name = 'download_csv_report')
def csv_report():
    users = User.query.all()
    service_reqs = Service__Request.query.all()
    csv_file_name = f'service_request_data_{datetime.datetime.now().strftime("%f")}.csv'
    with open(f'static/{csv_file_name}', 'w', newline="") as csvfile:
        sr_no = 1
        serv_req_csv = csv.writer(csvfile, delimiter=',')
        serv_req_csv.writerow(['Sr No', 'Service Name', 'Customer Name', 'Service Professional Name', 'Date Of Request', 'Date Of Completion', 'Status', 'Remarks', 'Rating', 'Amount'])
        for sr in service_reqs:
            this_sr = [sr_no, sr.service.service_name, sr.customer.full_name, sr.service_professional.full_name, sr.date_of_req, sr.date_of_completion, sr.service_status, sr.remarks, sr.rating, sr.service.service_price]
            serv_req_csv.writerow(this_sr)
            sr_no += 1

    return csv_file_name

# scheduled task
@shared_task(ignore_results = False, name = 'monthly_report')
def monthly_report():
    customers = User.query.join(UsersRoles).join(Role).filter(Role.name == "customer").all()
    return "Monthly reports sent"

# activity triggered task
@shared_task(ignore_results = False, name = 'service_request_status_update')
def service_req_update():
    return "Service Request Status is updated snd sent to the user."