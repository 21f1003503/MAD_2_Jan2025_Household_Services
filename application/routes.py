from .database import db
from .models import User, Role

from flask import current_app as app, jsonify, request
from flask_security import auth_required, roles_required, roles_accepted, current_user, hash_password

@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_home():
    return jsonify({
        "message": "Admin Logged In Successfully!!!"
    })

@app.route('/api/customer')
@auth_required('token')
@roles_required('admin', 'customer')
def customer_home():
    customer = current_user
    return jsonify({
        "Name": customer.name,
        "E-mail": customer.email,
        "Password": customer.password
    })

@app.post('/api/cu_registration')
def cu_registration():
    credentials = request.get_json()

    if not app.security.datastore.find_user(username = credentials["username"]):
        app.security.datastore.create_user(username = credentials["username"],
                                           full_name = credentials["full_name"],
                                           password = hash_password(credentials["password"]),
                                           roles = ["customer"])
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
                                           full_name = credentials["full_name"],
                                           password = hash_password(credentials["password"]),
                                           roles = ["service_professional"])
        db.session.commit()
        return jsonify({
            "message": "Service Professional Created Successfully!!!"
        }), 201
    
    return jsonify({
        "message": "Service Professional Already Exists!!!"
    }), 400