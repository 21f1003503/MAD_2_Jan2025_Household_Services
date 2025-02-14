from flask import Flask

from application.database import db
from application.models import User, Role
from application.config import LocalDevelopmentConfig

from flask_security import Security, SQLAlchemyUserDatastore
from flask_security import hash_password

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app

app = create_app()

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = 'admin', description = 'It is the superuser of the app.')
    app.security.datastore.find_or_create_role(name = 'customer', description = 'General user of the app.')
    app.security.datastore.find_or_create_role(name = 'service_professional', description = 'Provides services to the users of the app.')
    db.session.commit()

    if not app.security.datastore.find_user(email = "sajal@gmail.com"):
        app.security.datastore.create_user(email = "sajal@gmail.com", 
                                           password = hash_password("sajal"), 
                                           name = "Sajal Saxena",
                                           roles = ['admin', 'customer', 'service_professional'])
        
    if not app.security.datastore.find_user(email = "customer01@gmail.com"):
        app.security.datastore.create_user(email = "customer01@gmail.com",
                                           password = hash_password("customer01"),
                                           name = "Customer 01",
                                           roles = ["customer"])
    
    if not app.security.datastore.find_user(email = "sp01@gmail.com"):
        app.security.datastore.create_user(email = "sp01@gmail.com",
                                           password = hash_password("sp01"),
                                           name = "Service Professional 01",
                                           roles = ["service_professional"])
        
    db.session.commit()

from application.routes import *

if __name__ == "__main__":
    app.run()