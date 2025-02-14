from .database import db
from flask_security import UserMixin, RoleMixin


class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable = False)
    name = db.Column(db.String, nullable = False)
    password = db.Column(db.String, nullable = False)
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)           # used to create token
    active = db.Column(db.Boolean, nullable = False)                                # stores whether a user is active or not; more admin control over the user 
    roles = db.relationship('Role', backref = 'bearer', secondary = 'users_roles')
    # extra attributes:

class Role(db.Model, RoleMixin ):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String)

# association table since User and Roles share a many-to-many relationship
class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) 
    role_id = db.Column(db.Integer, db.ForeignKey('role.id')) 
