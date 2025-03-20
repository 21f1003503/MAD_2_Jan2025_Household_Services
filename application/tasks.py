from celery import shared_task
from .models import *
from .mail import send_email
import csv
import datetime
from .utils import format_report

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
    
    for cus in customers[1:]:
        customer_data = {}
        customer_data['full_name'] = cus.full_name
        customer_data['username'] = cus.username
        cus_serv_reqs = []
        for service_req in cus.serv_reqs:
            this_serv_req = {}
            this_serv_req["s_reqID"] = service_req.s_reqID
            this_serv_req["service_professional"] = service_req.spID
            this_serv_req["service_status"] = service_req.service_status
            this_serv_req["date_of_request"] = service_req.date_of_req
            this_serv_req["date_of_completion"] = service_req.date_of_completion
            this_serv_req["remarks"] = service_req.remarks
            this_serv_req["rating"] = service_req.rating
            this_serv_req["service_name"] = service_req.service.service_name
            this_serv_req["service_price"] = service_req.service.service_price
            cus_serv_reqs.append(this_serv_req)
        customer_data['cus_serv_reqs'] = cus_serv_reqs

        message = format_report('templates/customer_activity_report.html', data=customer_data)
        send_email(customer_data['username'], subject="Monthly Activity Report - FixItNow!", message=message)

    return "Monthly reports sent"

# activity triggered task
@shared_task(ignore_results = False, name = 'service_request_status_update')
def service_req_update():
    return "Service Request Status is updated snd sent to the user."