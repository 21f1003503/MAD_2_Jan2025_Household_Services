from flask import Flask
from flask_caching import Cache
import flask_excel as excel

from application.database import db
from application.models import User, Role, Service__Request, Service, ServiceRequestStatus
from application.config import LocalDevelopmentConfig
from application.celery.celery_factory import celery_init_app

from flask_security import Security, SQLAlchemyUserDatastore
from werkzeug.security import generate_password_hash

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    
    cache = Cache(app)

    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.cache = cache
    app.app_context().push()
    from application.resources import api
    api.init_app(app)
    return app

app = create_app()

celery_app = celery_init_app(app)
import application.celery.celery_schedule

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = 'admin', description = 'It is the superuser of the app.')
    app.security.datastore.find_or_create_role(name = 'customer', description = 'General user of the app.')
    app.security.datastore.find_or_create_role(name = 'service_professional', description = 'Provides services to the users of the app.')
    db.session.commit()

    if not app.security.datastore.find_user(username = "sajal@gmail.com"):
        app.security.datastore.create_user(username = "sajal@gmail.com", 
                                           password = generate_password_hash("sajal"), 
                                           full_name = "Sajal Saxena",
                                           roles = ['admin', 'customer', 'service_professional'],
                                           flag = "N/A",
                                           complaint_against = "N/A",
                                           sp_experience = -1,
                                           sp_verified_status = "N/A",
                                           sp_availability = "N/A",
                                           sp_avg_rating = -1.0
                                           )
        
    if not app.security.datastore.find_user(username = "customer01@gmail.com"):
        app.security.datastore.create_user(username = "customer01@gmail.com",
                                           password = generate_password_hash("customer01"),
                                           full_name = "Customer 01",
                                           roles = ["customer"],
                                           cu_address = "ABC Avenue, Mumbai",
                                           pincode = 400001,
                                           phone_number = 9898989898,
                                           sp_experience = -1,
                                           sp_verified_status = "N/A",
                                           sp_availability = "N/A",
                                           sp_avg_rating = -1.0
                                           )
    
    if not app.security.datastore.find_user(username = "sp01@gmail.com"):
        app.security.datastore.create_user(username = "sp01@gmail.com",
                                           password = generate_password_hash("sp01"),
                                           full_name = "Service Professional 01",
                                           roles = ["service_professional"],
                                           pincode = 400001,
                                           serviceID = 1,
                                           phone_number = 9988776600,
                                           sp_document = "/Users/sajalsaxena/Desktop/21F1003503_MAD_2_Jan_25/static/pablo_sarabia.jpeg",
                                           sp_experience = 1,
                                           )
        
    db.session.commit()

from application.routes import *
excel.init_excel(app)

if __name__ == "__main__":
    app.run()
