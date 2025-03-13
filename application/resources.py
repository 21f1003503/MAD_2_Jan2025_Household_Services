from flask_restful import Api, Resource, reqparse, request
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

# service_professional table arguments
serv_prof_parser = reqparse.RequestParser()
serv_prof_parser.add_argument('username')
serv_prof_parser.add_argument('password')
serv_prof_parser.add_argument('full_name')
serv_prof_parser.add_argument('id')
serv_prof_parser.add_argument('pincode')
serv_prof_parser.add_argument('phone_number')
serv_prof_parser.add_argument('flag')
serv_prof_parser.add_argument('complaint_against')
serv_prof_parser.add_argument('serviceID')
serv_prof_parser.add_argument('sp_experience')
serv_prof_parser.add_argument('sp_verified_status')
serv_prof_parser.add_argument('sp_availability')
serv_prof_parser.add_argument('sp_avg_rating')

# service request status table arguments
srs_parser = reqparse.RequestParser()
srs_parser.add_argument('s_reqID')
srs_parser.add_argument('spID')
srs_parser.add_argument('status')
  
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
                "rating": serv_req.rating,
                "service_name": serv_req.service.service_name
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
            this_serv_req["service_name"] = service_req.service.service_name
            this_serv_req["service_price"] = service_req.service.service_price
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
            #print(args)
            s_req = Service__Request(   serviceID = args["serviceID"],
                                        customerID = current_user.id,
                                        date_of_req = args["date_of_req"],
                                        
                                    )
            db.session.add(s_req)

            serv_profs = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional", User.serviceID == args["serviceID"]).all() 

            db.session.commit()

            latest_request = Service__Request.query.order_by(Service__Request.s_reqID.desc()).first()
            s_reqID = latest_request.s_reqID

            for sp in serv_profs:
                s_r_status = ServiceRequestStatus(
                    s_reqID = s_reqID,
                    spID = sp.id
                )               
                db.session.add(s_r_status)
                db.session.commit()      

            return {
                "message": "Service Request Created Successfully!!!"
            }
        except Exception as e:
            print('args:',args)
            print('e:',e)
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

class LoginServiceAPI(Resource):
    def get(self):
        servs = []
        services_json = []

        servs = Service.query.all()

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
        }, 404

class ServiceAPI(Resource):
    
    @auth_required('token')
    @roles_accepted('admin', 'customer', 'service_professional')
    def get(self, serviceID = None, category = None):

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
        
        if category:
            ser = []
            ser_json = []

            if "admin" in roles_list(current_user.roles) or "customer" in roles_list(current_user.roles):
                ser = Service.query.filter_by(category = category)
            elif "service_professional" in roles_list(current_user.roles):
                ser = current_user.services

            for s in ser:
                this_service = {}
                this_service["serviceID"] = s.serviceID
                this_service["service_name"] = s.service_name
                this_service["service_price"] = s.service_price
                this_service["category"] = s.category
                this_service["sub_category"] = s.sub_category
                this_service["service_desc"] = s.service_desc
                ser_json.append(this_service)

            if ser_json:
                return ser_json
            return {
                "message": "No Service Found!!!"
            }, 404

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
        }, 404

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = service_parser.parse_args()
        service_name = f"{args['category']}-{args['sub_category']}"

        try:
            serv = Service(service_name     = service_name,
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

class CustomerAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'service_professional', 'customer')
    def get(self):
        id = request.args.get('id', type=int)
        flag = request.args.get('flag', type=str)
        complaint_against = request.args.get('complaint_against', type=str)

        if any([id, flag, complaint_against]):
            customer = []
            customer_json = []

            if "admin" in roles_list(current_user.roles) or "customer" in roles_list(current_user.roles):
                if id:
                    customer = User.query.join(UsersRoles).join(Role).filter(Role.name == "customer", User.id == id).all()
                elif flag:
                    customer = User.query.join(UsersRoles).join(Role).filter(Role.name == "customer", User.flag == flag).all()
                elif complaint_against:
                    customer = User.query.join(UsersRoles).join(Role).filter(Role.name == "customer", User.complaint_against == complaint_against).all()
        
            for cus in customer:
                this_cus = {}
                this_cus["id"] = cus.id
                this_cus["full_name"] = cus.full_name
                this_cus["password"] = cus.password
                this_cus["username"] = cus.username
                this_cus["pincode"] = cus.pincode
                this_cus["phone_number"] = cus.phone_number
                this_cus["flag"] = cus.flag
                this_cus["complaint_against"] = cus.complaint_against
                customer_json.append(this_cus)

            if customer_json:
                return customer_json
            return {
                    "message": "No Customer Found!!!"
                }, 404
        
        customer = []
        customer_json = []

        if "admin" in roles_list(current_user.roles) or "service_professional" in roles_list(current_user.roles):
            customer  = User.query.join(UsersRoles).join(Role).filter(Role.name == "customer").all()

        for cus in customer:
            this_cus = {}
            this_cus["id"] = cus.id
            this_cus["full_name"] = cus.full_name
            this_cus["password"] = cus.password
            this_cus["username"] = cus.username
            this_cus["pincode"] = cus.pincode
            this_cus["phone_number"] = cus.phone_number
            this_cus["flag"] = cus.flag
            this_cus["complaint_against"] = cus.complaint_against
            customer_json.append(this_cus)

        if customer_json:
            return customer_json
        return {
                "message": "No Customer Found!!!"
            }, 404

class ServiceProfAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'service_professional', 'customer')
    def get(self):
        # if id or sp_verified_status or sp_availability or flag or complaint_against:
        id = request.args.get('id', type=int)
        sp_verified_status = request.args.get('sp_verified_status', type=str)
        sp_availability = request.args.get('sp_availability', type=str)
        flag = request.args.get('flag', type=str)
        complaint_against = request.args.get('complaint_against', type=str)
        serviceID = request.args.get('serviceID', type=int)

        if any([id, sp_verified_status, sp_availability, flag, complaint_against, serviceID]):

            serv_prof_one = []
            serv_prof__one_json = []

            if "admin" in roles_list(current_user.roles) or "service_professional" in roles_list(current_user.roles):
                if id:
                    serv_prof_one = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional", User.id == id).all()
                elif sp_verified_status:
                    serv_prof_one = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional", User.sp_verified_status == sp_verified_status).all()
                elif flag:
                    serv_prof_one = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional", User.flag == flag).all()
                elif complaint_against:
                    serv_prof_one = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional", User.complaint_against == complaint_against).all()
                elif sp_availability:
                    serv_prof_one = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional", User.sp_availability == sp_availability).all()
                elif serviceID:
                    serv_prof_one = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional", User.serviceID == serviceID).all()                        
            print(serv_prof_one)

            for sp in serv_prof_one:
                this_sp = {}
                this_sp["id"] = sp.id
                this_sp["full_name"] = sp.full_name
                this_sp["password"] = sp.password
                this_sp["username"] = sp.username
                this_sp["pincode"] = sp.pincode
                this_sp["phone_number"] = sp.phone_number
                this_sp["flag"] = sp.flag
                this_sp["complaint_against"] = sp.complaint_against
                this_sp["serviceID"] = sp.serviceID
                this_sp["sp_experience"] = sp.sp_experience
                this_sp["sp_verified_status"] = sp.sp_verified_status
                this_sp["sp_availability"] = sp.sp_availability
                this_sp["sp_avg_rating"] = sp.sp_avg_rating
                # this_sp["service_name"] = sp.services_performed.service_name 
                serv_prof__one_json.append(this_sp)

            if serv_prof__one_json:
                return serv_prof__one_json
            return {
                    "message": "No Service Professional Found!!!"
                }, 404   

        serv_prof_one = []
        serv_prof_json = []

        print("all service profs")

        if "admin" in roles_list(current_user.roles) or "customer" in roles_list(current_user.roles):
            serv_prof  = User.query.join(UsersRoles).join(Role).filter(Role.name == "service_professional").all()

        for sp in serv_prof:
            this_sp = {}
            this_sp["id"] = sp.id
            this_sp["full_name"] = sp.full_name
            this_sp["password"] = sp.password
            this_sp["username"] = sp.username
            this_sp["pincode"] = sp.pincode
            this_sp["phone_number"] = sp.phone_number
            this_sp["flag"] = sp.flag
            this_sp["complaint_against"] = sp.complaint_against
            this_sp["serviceID"] = sp.serviceID
            this_sp["sp_experience"] = sp.sp_experience
            this_sp["sp_verified_status"] = sp.sp_verified_status
            this_sp["sp_availability"] = sp.sp_availability
            this_sp["sp_avg_rating"] = sp.sp_avg_rating
            # this_sp["service_name"] = sp.services_performed.service_name 
            serv_prof_json.append(this_sp)

        if serv_prof_json:
            return serv_prof_json
        return {
            "message": "No Service Professional Found!!!"
        }, 404

class ServiceRequestStatusAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'service_professional', 'customer')
    def get(self):
        s_reqID = request.args.get('s_reqID', type=int)
        s_req_statusID = request.args.get('s_reqID', type=int)

        if any([s_reqID, s_req_statusID]):
            serv_req_status = []
            serv_req_status_json = []

            if "admin" in roles_list(current_user.roles):
                if s_reqID:
                    serv_req_status = ServiceRequestStatus.query.filter_by(s_reqID=s_reqID).all()
                elif s_req_statusID:
                    serv_req_status = ServiceRequestStatus.query.filter_by(s_req_statusID=s_req_statusID).all()

        if "admin" in roles_list(current_user.roles):
            serv_req_status = ServiceRequestStatus.query.all()
        else:
            serv_req_status = current_user.request_status

        for req in serv_req_status:
            this_req = {}
            this_req["s_req_statusID"] = serv_req_status.s_req_statusID
            this_req["s_reqID"] = serv_req_status.s_reqID
            this_req["spID"] = serv_req_status.spID
            this_req["status"] = serv_req_status.status
            serv_req_status_json.append(this_req)

        if serv_req_status_json:
            return serv_req_status_json
        else:
            return {
                "message": "No Service Requests Found!!!"
            }

api.add_resource(ServiceRequestApi, '/api/service_request/get',
                                    '/api/service_request/get/<int:s_reqID>',
                                    '/api/service_request/create', 
                                    '/api/service_request/update/<int:s_reqID>',
                                    '/api/service_request/delete/<int:s_reqID>')

api.add_resource(ServiceAPI, '/api/service/get',
                             '/api/service/get/<int:serviceID>',
                             '/api/service/get/<string:category>',
                             '/api/service/create',
                             '/api/service/update/<int:serviceID>',
                             '/api/service/delete/<int:serviceID>')

api.add_resource(LoginServiceAPI, '/api/login_services/get')

api.add_resource(ServiceProfAPI, '/api/serv_prof/get')
                                #  '/api/serv_prof/get/<int:id>',
                                #  '/api/serv_prof/get/<string:sp_verified_status>',
                                #  '/api/serv_prof/get/<string:flag>',
                                #  '/api/serv_prof/get/<string:complaint_against>',
                                #  '/api/serv_prof/get/<string:sp_availability>')

api.add_resource(CustomerAPI, '/api/customer/get')

api.add_resource(ServiceRequestStatusAPI, '/api/serv_req_status/get')