from .database import db
from .models import User, Role

from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required, roles_accepted, current_user, hash_password

@app.route('/', methods = ['GET'])
def home():
    #return "<h1>This is home page</h1>"
    return render_template('index.html')

#"@app.route('/login')"

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
        "E-mail": customer.username,
        "Password": customer.password
    })

@app.post('/api/cu_registration')
def cu_registration():
    credentials = request.get_json()
        
    if not app.security.datastore.find_user(username = credentials["username"]):
        app.security.datastore.create_user(username = credentials["username"],
                                           password = hash_password(credentials["password"]),
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
                                           password = hash_password(credentials["password"]),
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