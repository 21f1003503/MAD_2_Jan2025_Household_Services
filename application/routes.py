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

@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_home():
    return jsonify({
        "message": "Admin Logged In Successfully!!!"
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
                                           sp_experience = credentials["sp_experience"],
                                           )

        db.session.commit()
        return jsonify({
            "message": "Service Professional Created Successfully!!!"
        }), 201
    
    return jsonify({
        "message": "Service Professional Already Exists!!!"
    }), 400

# @app.route('/api/service_request/create/<string:service_category>')
# @auth_required('token')
# @roles_required('customer')
# def create_service_by_category(service_category):
#     cleaning_services = Service.query.filter_by(category = service_category)
   