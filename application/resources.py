from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, roles_accepted, current_user

api = Api()

parser = reqparse.RequestParser()
parser.add_argument('serviceID') 
parser.add_argument('spID') 
parser.add_argument('service_status') 
parser.add_argument('date_of_req')
parser.add_argument('date_of_completion') 
parser.add_argument('remarks') 
parser.add_argument('rating') 

def roles_list(roles):
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list

class ServiceRequestApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'customer', 'service_professional')
    def get(self):
        service_requests = []
        service_requests_json = []

        if "admin" in roles_list(current_user.roles):
            service_requests = Service_Request.query.all()
        else:
            service_requests = current_user.serv_reqs
        
        for service_req in service_requests:
            this_serv_req = {}
            this_serv_req["s_reqID"] = service_req.s_reqID
            this_serv_req["service"] = service_req.serviceID
            this_serv_req["customer"] = service_req.customerID
            this_serv_req["service_professional"] = service_req.spID
            this_serv_req["service_status"] = service_req.service_status
            this_serv_req["date_of_request"] = service_req.date_of_req
            this_serv_req["date_of_completion"] = service_req.date_of_completion
            this_serv_req["remarks"] = service_req.remarks
            this_serv_req["rating"] = service_req.rating
            service_requests_json.append(this_serv_req)
            
        if service_requests_json:
            return service_requests_json

        return {
            "message": "No Service Request Found!!!"
        }, 404
    
    @auth_required('token')
    @roles_required('customer') # used roles_required here instead of roles_accepted because only customer can create a new service request
    def post(self):
        args = parser.parse_args()
        try:
            service_req = Service_Request(serviceID = args["serviceID"],
                                        customerID = current_user.id,
                                        date_of_req = args["date_of_req"],
                                        service_status = args['service_status'])
            db.session.add(service_req)
            db.session.commit()
            return {
                "message": "Service Request Created Successfully!!!"
            }
        except:
            return {
                "message": "One or More Required Fields Are Missing!!!"
            }, 400
    
api.add_resource(ServiceRequestApi, '/api/service_request/get', '/api/service_request/create')