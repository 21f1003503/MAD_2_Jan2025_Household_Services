from .database import db
from flask_security import UserMixin, RoleMixin

class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True, nullable = False)
    full_name = db.Column(db.String, nullable = False)
    password = db.Column(db.String, nullable = False)
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)                      # used to create token
    active = db.Column(db.Boolean, nullable = False)                                           # stores whether a user is active or not; more admin control over the user 
    roles = db.relationship('Role', backref = 'bearer', secondary = 'users_roles')
    
    # extra attributes:

    # unique to customers
    cu_address = db.Column(db.String)

    # common to both customers and service professionals
    pincode = db.Column(db.Integer)                                                             # has to be a 6-digit integer only
    phone_number = db.Column(db.Integer)                                                        # has to be 10-digit integer only
    flag = db.Column(db.String, default = "GREEN")                                              # GREEN, RED
    complaint_against = db.Column(db.Boolean)

    # unique to service professional
    category = db.Column(db.String, db.ForeignKey('service.category'))
    sub_category = db.Column(db.String, db.ForeignKey('service.sub_category'))
    sp_experience = db.Column(db.Integer)
    sp_document = db.Column(db.String)
    sp_verified_status = db.Column(db.String)                                                   # UNVERIFIED, VERIFIED
    sp_availability = db.Column(db.String)                                                      # AVAILABLE, UNAVAILABLE
    sp_avg_rating = db.Column(db.Float)

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String)

# association table since User and Roles share a many-to-many relationship
class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  
    role_id = db.Column(db.Integer, db.ForeignKey('role.id')) 

# Services that can only be created by the Admin
class Service(db.Model):
    serviceID = db.Column(db.Integer, primary_key = True)
    service_name = db.Column(db.String, nullable = False, unique = True)
    service_price = db.Column(db.Integer, nullable = False, default = 100)
    category = db.Column(db.String, nullable = False)
    sub_category = db.Column(db.String, nullable = False)
    service_desc = db.Column(db.String)

# Service Request created by the customer
class Service_Request(db.Model):
    s_reqID = db.Column(db.Integer, primary_key = True)
    service_name = db.Column(db.String, db.ForeignKey('service.service_name'))
    customerID = db.Column(db.Integer, db.ForeignKey('user.id'))
    spID = db.Column(db.Integer, db.ForeignKey('user.id'))
    service_status = db.Column(db.String, nullable = False, default = 'REQUESTED') # REQUESTED, ASSIGNED, CLOSED
    date_of_req = db.Column(db.String, nullable = False)
    date_of_completion = db.Column(db.String, default = "Yet to be completed...")
    remarks = db.Column(db.String)
    rating = db.Column(db.Integer, nullable = False)

