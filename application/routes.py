from flask import current_app as app, jsonify
from flask_security import auth_required, roles_required, roles_accepted, current_user

@app.route('/admin')
@auth_required('token')
@roles_required('admin')
def admin_home():
    return jsonify({
        "message": "Admin Logged In Successfully!!!"
    })

@app.route('/customer')
@auth_required('token')
@roles_required('admin', 'customer')
def customer_home():
    customer = current_user
    return jsonify({
        "Name": customer.name,
        "E-mail": customer.email,
        "Password": customer.password
    })

