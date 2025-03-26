export default {
    template: `
        <div v-if="userData.sp_verified_status == 'VERIFIED' && userData.flag == 'GREEN'">
            <h2 class="mt-2 mb-2">Welcome, {{ userData.full_name }}!</h2>
            <div class="row border">
                <div class="col-8" style="height: 700px; overflow-y: scroll">
                    <h3 class = "text-center mt-2">Available Service Requests</h3>
                    <div v-if="userData.sp_availability == 'AVAILABLE'">
                        <table class="table table-hover table-striped table-bordered table-warning">
                            <thead class="table-primary">
                                <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Request ID</th>
                                <th scope="col">Customer</th>
                                <th scope="col">Date Of Request</th>
                                <th scope="col">Pincode</th>
                                <th scope="col">Address</th>
                                <th scope="col">Customer Phone No.</th>
                                <th scope="col">Service Status</th>
                                <th scope="col">Request Status</th>
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody v-for="sr in userServReqs" v-if="sr.service_status != 'CLOSED'">
                                <tr>
                                    <th scope="row">{{ sr.s_req_statusID }}</th>
                                    <td>{{ sr.s_reqID }}</td>
                                    <td>{{ sr.customer }}</td>
                                    <td>{{ sr.date_of_req }}</td>
                                    <td>{{ sr.cu_pincode }}</td>
                                    <td>{{ sr.cu_address }}</td>
                                    <td>{{ sr.customer_contact }}</td>
                                    <td>{{ sr.service_status }}</td>
                                    <td>{{ sr.status }}</td>
                                    <td>
                                    <div v-if="sr.status == 'PENDING'">
                                        <button @click="acceptService(sr.s_req_statusID)" class="btn btn-success btn-sm">ACCEPT</button>
                                        <button @click="rejectService(sr.s_req_statusID)" class="btn btn-danger btn-sm">REJECT</button> 
                                    </div>
                                    <div v-else>
                                        <button class="btn btn-primary disabled btn-sm">UNAVAILABLE</button>
                                    </div> 
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="userData.sp_availability == 'UNAVAILABLE'">
                        <strong><p class="text-center mt-5 mb-5">You Are Already Assigned A Service, Complete It Before Accepting Another One...</p></strong>
                    </div>

                    <h3 class = "text-center mt-2">Your Service Requests</h3>
                    <div>
                        <table class="table table-hover table-striped table-bordered table-warning">
                            <thead class="table-primary">
                                <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Request ID</th>
                                <th scope="col">Customer</th>
                                <th scope="col">Date Of Request</th>
                                <th scope="col">Pincode</th>
                                <th scope="col">Address</th>
                                <th scope="col">Customer Phone No.</th>
                                <th scope="col">Service Status</th>
                                
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody v-for="sr in userServReqs" v-if="sr.status == 'ACCEPTED'">
                                <tr>
                                    <th scope="row">{{ sr.s_req_statusID }}</th>
                                    <td>{{ sr.s_reqID }}</td>
                                    <td>{{ sr.customer }}</td>
                                    <td>{{ sr.date_of_req }}</td>
                                    <td>{{ sr.cu_pincode }}</td>
                                    <td>{{ sr.cu_address }}</td>
                                    <td>{{ sr.customer_contact }}</td>
                                    <td>{{ sr.service_status }}</td>
                                    
                                    <td>
                                    <div v-if="sr.status == 'PENDING'">
                                        <button @click="acceptService(sr.s_req_statusID)" class="btn btn-success btn-sm">ACCEPT</button>
                                        <button @click="rejectService(sr.s_req_statusID)" class="btn btn-danger btn-sm">REJECT</button> 
                                    </div>
                                    <div v-else>
                                        <button class="btn btn-primary disabled btn-sm">UNAVAILABLE</button>
                                    </div> 
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-4" style="height: 700px; overflow-y: scroll">
                    <h3 class = "text-center mt-2">Your Profile</h3>
                    <div class="card text-center">
                    <div class="card-header">
                        ID: {{ userData.id }}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ userData.full_name }}</h5>
                        <h6 class="card-tex mt-2">Username: {{ userData.username }}</h6>
                        <h6 class="card-text">Pincode: {{ userData.pincode }}</h6>
                        <h6 class="card-text">Phone Number: +91 {{ userData.phone_number }}</h6>
                        <h6 class="card-text">Complaints Against: {{ userData.complaint_against }}</h6>
                        <h6 class="card-text">Flag: {{ userData.flag }}</h6>
                    </div>
                    
                </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center" style="height: 700px;">
            <div class="text-center mx-auto" style="width: 700px; height: 300px;">
            <h5 class="text-center mx-auto mt-5">WAIT FOR THE ADMIN TO VERIFY YOU... or you are Red flagged by the Admin!</h5>
            </div>
        </div>
    `,
    data() {
        return {
            userData: "",
            userServReqs: null
        }
    },
    mounted() {
        this.loadUser()
        this.loadServReqStatus()
    },
    methods: {
        loadUser(){
            fetch('/api/sp_home', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.userData = data)
        },
        loadServReqStatus(){
            fetch('/api/serv_req_status/get' ,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.userServReqs = data)
        },
        acceptService(s_req_statusID){
            fetch(`/api/serv_prof/accept_request/${s_req_statusID}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({
                    s_status: 'ACCEPTED'
                })
            })
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    window.location.reload(); 
                }, 50);
                this.loadServices()
            })
        },
        rejectService(s_req_statusID){
            fetch(`/api/serv_prof/reject_request/${s_req_statusID}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({
                    s_status: 'REJECTED'
                })
            })
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    window.location.reload(); 
                }, 50);
                
            })
        
        }
    },
}