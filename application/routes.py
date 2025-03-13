from .database import db
from .models import User, Role, Service__Request, Service, ServiceRequestStatus
from .utils import roles_list

from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required, roles_accepted, current_user, login_user
from werkzeug.security import check_password_hash, generate_password_hash

@app.route('/', methods = ['GET'])
def home():
    #return "<h1>This is home page</h1>"
    return render_template('index.html')

@app.route('/api/login', methods = ['POST'])
def user_login():
    body = request.get_json()
    username = body['username']
    password = body['password']

    if not username:
        return jsonify({
            "message": "Username is Required!!!"
        }), 400
    
    user = app.security.datastore.find_user(username = username)

    if user:
        if check_password_hash(user.password, password):
            
            '''if current_user is None:
                return jsonify({
                        "message": "A User is Already Logged In!!!"
                    }), 400'''
            login_user(user)                                    # to load the current user on the session
            return jsonify({
                    "id": user.id,
                    "username": user.username,
                    "full_name": user.full_name,
                    "auth-token": user.get_auth_token(),
                    "roles": roles_list(user.roles)
                    
            })
            
        else:
            return jsonify({
                "message": "Incorrect Password!!!"
            }), 400
    else:
        return jsonify({
            "message": "User Not Found!!!"
        }), 404
    
@app.route('/api/home')
@auth_required('token')
@roles_accepted('admin', 'customer', 'service_professional')
def user_home():
    user = current_user
    return jsonify({
        "username": user.username,
        "full_name": user.full_name,
        "roles": roles_list(user.roles)
    })

@app.route('/api/cu_home')
@auth_required('token')
@roles_required('customer')
def cu_home():
    cus  = current_user
    return jsonify({
        "id": cus.id,
        "username": cus.username,
        "password": cus.password,
        "full_name": cus.full_name,
        "roles": roles_list(cus.roles),
        "cu_address": cus.cu_address,
        "pincode": cus.pincode,
        "flag": cus.flag,
        "complaint_against": cus.complaint_against
    })

@app.route('/api/sp_home')
@auth_required('token')
@roles_required('service_professional')
def sp_home():
    cus = current_user
    return jsonify({
        "id": cus.id,
        "username": cus.username,
        "password": cus.password,
        "full_name": cus.full_name,
        "roles": roles_list(cus.roles),
        "pincode": cus.pincode,
        "phone_number": cus.phone_number,
        "flag": cus.flag,
        "complaint_against": cus.complaint_against,
        "serviceID": cus.serviceID,
        "sp_experience": cus.sp_experience,
        "sp_verified_status": cus.sp_verified_status,
        "sp_avg_rating": cus.sp_avg_rating,
        "sp_availability": cus.sp_availability
    })

@app.route('/api/admin_home')
@auth_required('token')
@roles_required('admin')
def admin_home():
    admin = current_user
    return jsonify({
        "id": admin.id,
        "full_name": admin.full_name,
        "password": admin.password,
        "roles": roles_list(admin.roles)
    })

@app.route('/api/customer')
@auth_required('token')
@roles_accepted('admin', 'customer')
def customer_home():
    customer = current_user
    return jsonify({
        "Name": customer.name,
        "E-mail": customer.username,
        "Password": customer.password
    })

@app.post('/api/cu_registration')
def cu_registration():
    credentials = request.get_json()
        
    if not app.security.datastore.find_user(username = credentials["username"]):
        app.security.datastore.create_user(username = credentials["username"],
                                           password = generate_password_hash(credentials["password"]),
                                           full_name = credentials["full_name"],
                                           roles = ["customer"],
                                           cu_address = credentials["cu_address"],
                                           pincode = credentials["pincode"],
                                           phone_number = credentials["phone_number"],
                                           )

        db.session.commit()
        return jsonify({
            "message": "Customer Created Successfully!!!"
        }), 201
    
    return jsonify({
        "message": "Customer Already Exists!!!"
    }), 400

@app.post('/api/sp_registration')
def sp_registration():
    credentials = request.get_json()
        
    if not app.security.datastore.find_user(username = credentials["username"]):
        app.security.datastore.create_user(username = credentials["username"],
                                           password = generate_password_hash(credentials["password"]),
                                           full_name = credentials["full_name"],
                                           roles = ["service_professional"],
                                           pincode = credentials["pincode"],
                                           phone_number = credentials["phone_number"],
                                           serviceID = credentials["serviceID"],
                                           sp_experience = credentials["sp_experience"],
                                           )

        db.session.commit()
        return jsonify({
            "message": "Service Professional Created Successfully!!!"
        }), 201
    
    return jsonify({
        "message": "Service Professional Already Exists!!!"
    }), 400

@auth_required('token')
@roles_required('admin')
@app.route('/api/admin/change_sp_verified_status/<int:id>', methods = ['POST'])
def change_sp_verified_status(id):
       body = request.get_json()
       sp = User.query.get(id)
       
       if sp.sp_verified_status == 'UNVERIFIED':
           sp.sp_verified_status = "VERIFIED"
       elif sp.sp_verified_status == "VERIFIED":
           sp.sp_verified_status = 'UNVERIFIED'
        
       db.session.commit()
       return {
           "message": "Service Professional Verification Status Updated Successfully!!!"
       }

@auth_required('token')
@roles_required('service_professional')
@app.route('/api/serv_prof/accept_request/<int:s_req_statusID>', methods = ['POST'])
def accept_request(s_req_statusID):
    # body = request.get_json()
    serv_req_status = ServiceRequestStatus.query.get(s_req_statusID)
    serv_req_status.status = 'ACCEPTED'
    s_reqID = serv_req_status.s_reqID
    spID = current_user.id
    serv_req = Service__Request.query.get(s_reqID)
    serv_req.spID = spID
    serv_req.service_status = 'ASSIGNED'

    other_req_statuses = ServiceRequestStatus.query.filter(
        ServiceRequestStatus.s_reqID == s_reqID,
        ServiceRequestStatus.s_req_statusID != s_req_statusID 
    ).all()

    for s_status in other_req_statuses:
        s_status.status = 'REJECTED'

    db.session.commit()
    return{
        "message": "Service Accepted Successfully!!!"
    }

@auth_required('token')
@roles_required('service_professional')
@app.route('/api/serv_prof/reject_request/<int:s_req_statusID>', methods = ['POST'])
def reject_request(s_req_statusID):
    serv_req_status = ServiceRequestStatus.query.get(s_req_statusID)
    serv_req_status.status = 'REJECTED'
    db.session.commit()
    return{
        "message": "Service Request Rejected!!!"
    }

@auth_required('token')
@roles_required('customer')
@app.route('/api/customer/close_service_request/<int:s_reqID>', methods = ['POST'])
def close_service_request(s_reqID):
    body = request.get_json()
    serv_req = Service__Request.query.get(s_reqID)
    id = serv_req.spID
    sp = User.query.get(id)
    avg_rating = sp.sp_avg_rating

    serv_req.date_of_completion = body['date_of_completion']
    serv_req.remarks = body['remarks']
    serv_req.rating = body['rating']

    sp_service_completed = Service__Request.query.filter(Service__Request.spID == id, Service__Request.service_status == 'CLOSED').count()
    if sp_service_completed == 0:
        sp.sp_avg_rating = serv_req.rating
    else:
        sp.sp_avg_rating = (((avg_rating * sp_service_completed) + serv_req.rating)/(sp_service_completed + 1))

    serv_req.service_status = 'CLOSED'
    db.session.commit()
    return{
        "message": "Service Request Closed Successfully!!!"
    }