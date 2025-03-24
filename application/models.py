from .database import db
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
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
    complaint_against = db.Column(db.String, default = "FALSE")

    # unique to service professional
    serviceID = db.Column(db.Integer, db.ForeignKey('service.serviceID'), nullable = True)
    sp_experience = db.Column(db.Integer, default = 1)
    sp_document = db.Column(db.String)
    sp_verified_status = db.Column(db.String, default = "UNVERIFIED")                           # UNVERIFIED, VERIFIED
    sp_availability = db.Column(db.String, default = "AVAILABLE")                               # AVAILABLE, UNAVAILABLE
    sp_avg_rating = db.Column(db.Float, default = 0.0)

    # to access service details
    services_performed = db.relationship("Service", foreign_keys = [serviceID], backref = 'serv_profs')

    # to access service requests
    #service_requests = db.relationship("Service_Request", backref = "customer", cascade = "all, delete-orphan")
    #serv_prof_requests = db.relationship('Service_Request', foreign_keys = "[Service_Request.spID]", back_populates = "service_professional")

    # validation
    @validates('pincode')
    def validate_pincode(self,key,value):
        if len(str(value)) != 6:
            raise ValueError("PIN code must be exactly 6 digits.")
        return value
    
    @validates('phone_number')
    def validate_phone_number(self,key,value):
        if len(str(value)) != 10:
            raise ValueError("Phone number must be exactly 10 digits.")
        return value

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

    #serv_profs = db.relationship("User", backref = "services")

# Service Request created by the customer
class Service__Request(db.Model):
    s_reqID = db.Column(db.Integer, primary_key = True)
    serviceID = db.Column(db.String, db.ForeignKey('service.serviceID'))
    customerID = db.Column(db.Integer, db.ForeignKey('user.id'))
    spID = db.Column(db.Integer, db.ForeignKey('user.id'))
    service_status = db.Column(db.String, default = 'REQUESTED') # REQUESTED, ASSIGNED, CLOSED
    date_of_req = db.Column(db.String, nullable = False)
    date_of_completion = db.Column(db.String, default = "Yet to be completed...")
    remarks = db.Column(db.String)
    rating = db.Column(db.Integer)

    # relationships
    service = db.relationship("Service", foreign_keys = [serviceID], backref = "service_requests")
    customer = db.relationship("User", foreign_keys = [customerID], backref = "serv_reqs")
    service_professional = db.relationship("User", foreign_keys = [spID], backref = "serv_prof_requests")

class ServiceRequestStatus(db.Model):
    s_req_statusID = db.Column(db.Integer, primary_key = True)
    s_reqID = db.Column(db.Integer, db.ForeignKey('service___request.s_reqID'))
    spID = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String, default = 'PENDING') # PENDING, ACCEPTED, REJECTED

    # relationships
    serv_request = db.relationship("Service__Request", foreign_keys = [s_reqID], backref = "serv_request_status")
    serv_professional = db.relationship("User", backref = "request_status")

class Complaints(db.Model):
    complaintID = db.Column(db.Integer, primary_key=True)
    s_reqID = db.Column(db.Integer, db.ForeignKey('service___request.s_reqID'))
    complaint_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    complaint_on = db.Column(db.Integer, db.ForeignKey('user.id'))
    complaint_desc = db.Column(db.String)
    complaint_status = db.Column(db.String, default="PENDING")  # PENDING, RESOLVED
    result = db.Column(db.String, default="IN PROGRESS")

    # Relationships (following existing pattern)
    filed_by = db.relationship('User', foreign_keys=[complaint_by],backref='filed_complaints')
    filed_against = db.relationship('User', foreign_keys=[complaint_on],backref='received_complaints')
    service_request = db.relationship('Service__Request',foreign_keys=[s_reqID], backref='complaints')
