from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, roles_accepted, current_user
from .utils import roles_list

api = Api()

# service_request table arguments
s_req_parser = reqparse.RequestParser()
s_req_parser.add_argument('serviceID') 
s_req_parser.add_argument('spID') 
s_req_parser.add_argument('service_status')
s_req_parser.add_argument('date_of_req')
s_req_parser.add_argument('date_of_completion') 
s_req_parser.add_argument('remarks') 
s_req_parser.add_argument('rating') 

# service table arguments
service_parser = reqparse.RequestParser()
service_parser.add_argument('service_name')
service_parser.add_argument('service_price')
service_parser.add_argument('category')
service_parser.add_argument('sub_category')
service_parser.add_argument('service_desc')

# user table arguments
user_parser = reqparse.RequestParser()
user_parser.add_argument('username')
user_parser.add_argument('password')
user_parser.add_argument('cu_address')
user_parser.add_argument('pincode')
user_parser.add_argument('phone_number')
user_parser.add_argument('sp_experience')
user_parser.add_argument('sp_document')
user_parser.add_argument('sp_avg_rating')
  
class ServiceRequestApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'customer', 'service_professional')
    def get(self, s_reqID = None):

        if s_reqID:
            serv_req = Service__Request.query.get(s_reqID)

            if serv_req is None:
                return{
                    "message": "Service Request Not Found!!!"
                }, 404
            
            return{
                "s_reqID": serv_req.s_reqID,
                "serviceID": serv_req.serviceID,
                "customerID": serv_req.customerID,
                "spID": serv_req.spID,
                "service_status": serv_req.service_status,
                "date_of_req": serv_req.date_of_req,
                "date_of_completion": serv_req.date_of_completion,
                "remarks": serv_req.remarks,
                "rating": serv_req.rating
            }

        service_requests = []
        service_requests_json = []

        if "admin" in roles_list(current_user.roles):
            service_requests = Service__Request.query.all()
        else:
            service_requests = current_user.serv_reqs
        
        for service_req in service_requests:
            this_serv_req = {}
            this_serv_req["s_reqID"] = service_req.s_reqID
            this_serv_req["serviceID"] = service_req.serviceID
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
        args = s_req_parser.parse_args()

        try:
            print(args)
            s_req = Service__Request(serviceID = args["serviceID"],
                                        customerID = current_user.id,
                                        date_of_req = args["date_of_req"],
                                        spID = args["spID"],
                                        service_status = args["service_status"],
                                        date_of_completion = args["date_of_completion"],
                                        remarks = args["remarks"],
                                        rating = args["rating"]
                                        )
            db.session.add(s_req)
            db.session.commit()
            return {
                "message": "Service Request Created Successfully!!!"
            }
        except Exception as e:
            print(e)
            return {
                "message": "One or More Required Fields Are Missing!!!"
            }, 400
        
    @auth_required('token')
    @roles_required('customer')
    def put(self, s_reqID):
        args = s_req_parser.parse_args()
        serv_req = Service__Request.query.get(s_reqID)

        if args['spID'] is not None:
            serv_req.spID                   = args['spID']
        if args['service_status'] is not None:
            serv_req.service_status         = args['service_status']
        if args['date_of_completion'] is not None:
            serv_req.date_of_completion     = args['date_of_completion']
        if args['remarks'] is not None:
            serv_req.remarks                = args['remarks']
        if args['rating'] is not None:
            serv_req.rating                 = args['rating']
        
        db.session.commit()
        return {
            "message": "Service Request Updated Succcessfully!!!"
        }
    
    @auth_required('token')
    @roles_required('customer')
    def delete(self, s_reqID):
        serv_req = Service__Request.query.get(s_reqID)

        if serv_req:
            db.session.delete(serv_req)
            db.session.commit()
            return {
                "message": "Service Request Deleted Successfully!!!"
            }
        else:
            return{
                "message": "Service Request Not Found!!!"
            }, 404

class ServiceAPI(Resource):
    
    @auth_required('token')
    @roles_accepted('admin', 'customer', 'service_professional')
    def get(self, serviceID = None):

        if serviceID:
            ser = Service.query.get(serviceID)

            if ser is None:
                return{
                    "message": "Service Not Found!!!"
                }, 404
            
            return {
                "serviceID": ser.serviceID,
                "service_name": ser.service_name,
                "service_price": ser.service_price,
                "category": ser.category,
                "sub_category": ser.sub_category,
                "service_desc": ser.service_desc
            }

        servs = []
        services_json = []

        if "admin" in roles_list(current_user.roles) or "customer" in roles_list(current_user.roles):
            servs = Service.query.all()
        elif "service_professional" in roles_list(current_user.roles):
            servs = current_user.services

        for s in servs:
            this_service = {}
            this_service["serviceID"] = s.serviceID
            this_service["service_name"] = s.service_name
            this_service["service_price"] = s.service_price
            this_service["category"] = s.category
            this_service["sub_category"] = s.sub_category
            this_service["service_desc"] = s.service_desc
            services_json.append(this_service)

        if services_json:
            return services_json
        return {
            "message": "No Service Found!!!"
        }, 

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = service_parser.parse_args()

        try:
            serv = Service(service_name     = args['service_name'],
                           service_price    = args['service_price'],
                           category         = args['category'],
                           sub_category     = args['sub_category'],
                           service_desc     = args['service_desc']
                           )
            db.session.add(serv)
            db.session.commit()
            return {
                "message": "New Service Created Succesfully!!!"
            }
        except:
            services = Service.query.filter_by(service_name = args['service_name'])
            if services:
                return {
                    "message": "Service Already Exists!!!"
                }, 400
            return {
               "message": "One or More Required Fields Are Missing!!!"
            }, 400

    @auth_required('token')
    @roles_required('admin')
    def put(self, serviceID):
        args = service_parser.parse_args()
        service = Service.query.get(serviceID)

        if not service:
            return {
                "message": "Service Not Found!!!"
            }, 404
        
        if args['service_price'] is not None:
            service.service_price = args['service_price']
        if args['service_desc'] is not None:
            service.service_desc = args['service_desc']

        db.session.commit()
        return {
            "message": "Service Updated Successfully!!!"
        }
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, serviceID):
        service = Service.query.get(serviceID)

        if not service:
            return {
                "message": "Service Not Found!!!"
            }, 404
        
        db.session.delete(service)
        db.session.commit()
        return{
            "message": "Service Deleted Successfully!!!"
        }

api.add_resource(ServiceRequestApi, '/api/service_request/get',
                                    '/api/service_request/get/<int:s_reqID>',
                                    '/api/service_request/create', 
                                    '/api/service_request/update/<int:s_reqID>',
                                    '/api/service_request/delete/<int:s_reqID>')

api.add_resource(ServiceAPI, '/api/service/get',
                             '/api/service/get/<int:serviceID>',
                             '/api/service/create',
                             '/api/service/update/<int:serviceID>',
                             '/api/service/delete/<int:serviceID>')