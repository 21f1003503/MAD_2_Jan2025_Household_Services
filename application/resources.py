from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, roles_accepted

api = Api()

parser = reqparse.RequestParser()

parser.add_argument()

def roles_list(roles):
    roles_list = []
    for role in roles:
        roles_list.append(role.name)
    return roles_list

class ServiceAPI(Resource):
    def get(self):
        services = []
        services_json = []

        