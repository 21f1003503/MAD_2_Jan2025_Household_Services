User based Routes:

    /api/login
    /api/cu_home
    /api/sp_home
    /api/admin_home
    /api/cu_registration
    /api/sp_registration
    /api/admin/change_sp_verified_status/<int:id>
    /api/flag_user/<int:id>

User Based APIs:

    /api/customer/get
    /api/serv_prof/get
    /api/serv_prof/get?id
    /api/serv_prof/get?flag
    /api/serv_prof/get?sp_verified_status
    /api/serv_prof/get?complaint_against
    /api/serv_prof/get?sp_availability

Service Based Routes:
    
    /api/delete_service/<int:serviceID>

Service Based APIs:

    /api/service/get
    /api/service/get/<int:serviceID>
    /api/service/get/<string:category>
    /api/service/create
    /api/service/update/<int:serviceID>
    /api/service/delete/<int:serviceID>
    /api/login_services/get

Service Request Based Routes:

    /api/serv_prof/accept_request/<int:s_req_statusID>
    /api/serv_prof/reject_request/<int:s_req_statusID>
    /api/customer/close_service_request/<int:s_reqID>
    /api/delete_service_req/<int:s_reqID>

Service Request Based APIs:

    /api/service_request/get
    /api/service_request/get/<int:s_reqID>
    /api/service_request/create
    /api/service_request/update/<int:s_reqID>
    /api/service_request/delete/<int:s_reqID>

Complaints Based Routes:

    /api/resolve_complaint/<int:complaintID>/<string:flag>

Complaints Based APIs:

    /api/complaints/get
    /api/complaints/get/<int:complaintID>
    /api/complaints/create/<int:s_reqID>

Service Request Status Based API:

    /api/serv_req_status/get

Search Functionality Based Route:

    /search

Backend Jobs Based Routes:

    /api/export
    /api/csv_result/<id>
    /api/send_reports

Possible Values:
    USER:
        flag: GREEN, RED
        complaint_against: TRUE, FALSE
        sp_verified_status: VERIFIED, UNVERIFIED
        sp_availability: AVAILABLE, UNAVAILABLE

    ROLE:
        name: admin, customer, service_professional

    SERVICE REQUEST:
        service_status: REQUESTED, ASSIGNED, CLOSED

    SERVICE REQUEST STATUS:
        status: PENDING, ACCEPTED, REJECTED

    COMPLAINT:
        complaint_status: PENDING, RESOLVED