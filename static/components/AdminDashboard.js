export default {
    template: `
        <div class="row ">
            <div class="col-8 " style="height: 770px;" >
                <h2>Welcome Admin, {{ userData.full_name }}</h2>
                <router-link class="btn btn-primary my-2" to="/admin/services">Services</router-link>
                <router-link class="btn btn-primary my-2" to="/admin/service_requests">Service Requests</router-link>
                <router-link class="btn btn-primary my-2" to="/admin/customers">Customers</router-link>
                <router-link class="btn btn-primary my-2" to="/admin/service_professionals">Service Professionals</router-link>
                <router-link class="btn btn-primary my-2" to="/admin/complaints">Conflicts</router-link>
                <button @click="csvExport" class="btn btn-warning my-2">Download CSV</button>

                <div class="row  mx-auto mt-3" style=" height: 500px; width: 800px; overflow-y: scroll; ">
                    <div class="accordion mt-3 mx-auto" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                <h4>Requested Service Requests</h4>
                            </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-hover table-warning table-striped table-bordered text-center">
                                    <thead class="table-primary">
                                        <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Service ID</th>
                                        <th scope="col">Customer ID</th>
                                        <th scope="col">Service Status</th>
                                        <th scope="col">Date Of Request</th>
                                        </tr>
                                    </thead>
                                    <tbody v-for="sr in userServiceReqs" v-if="sr.service_status == 'REQUESTED'">
                                        <tr>
                                            <th scope="row">{{ sr.s_reqID }}</th>
                                            <td>{{ sr.serviceID }}</td>
                                            <td>{{ sr.customer }}</td>
                                            <td>{{ sr.service_status }}</td>
                                            <td>{{ sr.date_of_request }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                        <div class="accordion-item mt-2">
                            <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                <h4>Accepted Service Requests</h4>
                            </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-hover table-warning table-striped table-bordered text-center">
                                    <thead class="table-primary">
                                        <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Service ID</th>
                                        <th scope="col">Customer ID</th>
                                        <th scope="col">SP ID</th>
                                        <th scope="col">Service Status</th>
                                        <th scope="col">Date Of Request</th>
                                        
                                        
                                        </tr>
                                    </thead>
                                    <tbody v-for="sr in userServiceReqs" v-if="sr.service_status == 'ASSIGNED'">
                                        <tr>
                                            <th scope="row">{{ sr.s_reqid }}</th>
                                            <td>{{ sr.serviceID }}</td>
                                            <td>{{ sr.customer }}</td>
                                            <td>{{ sr.service_professional }}</td>
                                            <td>{{ sr.service_status }}</td>
                                            <td>{{ sr.date_of_request }}</td>
                                            
                                            
                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                        <div class="accordion-item mt-2">
                            <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                <h4>Completed Service Requests</h4>
                            </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-hover table-warning table-striped table-bordered text-center">
                                    <thead class="table-primary">
                                        <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Service ID</th>
                                        <th scope="col">Customer ID</th>
                                        <th scope="col">SP ID</th>
                                        <th scope="col">Service Status</th>
                                        <th scope="col">Date Of Request</th>
                                        <th scope="col">Date Of Completion</th>
                                        <th scope="col">Remarks</th>
                                        <th scope="col">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody v-for="sr in userServiceReqs" v-if="sr.service_status == 'CLOSED'">
                                        <tr>
                                            <th scope="row">{{ sr.s_reqID }}</th>
                                            <td>{{ sr.serviceID }}</td>
                                            <td>{{ sr.customer }}</td>
                                            <td>{{ sr.service_professional }}</td>
                                            <td>{{ sr.service_status }}</td>
                                            <td>{{ sr.date_of_request }}</td>
                                            <td>{{ sr.date_of_completion }}</td>
                                            <td>{{ sr.remarks }}</td>
                                            <td>{{ sr.rating }}</td>
                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="col-4" style="height: 750px; overflow-y: scroll">
                <h4 class="text-center mt-2">Unverified Service Professionals</h4>
                <div v-for="sp in unverified_serv_profs" class="card mt-2 border-danger">
                    <div v-if="sp.serviceID" class="card-body text-danger">
                        
                        <strong><h4 class="card-title"> {{ sp.id }} {{ sp.full_name }}</h4></strong>
                        <h6>Email: {{ sp.username }} </h6>
                        <h6>Service: {{ sp.serviceID }} </h6>
                        <h6>Pincode: {{ sp.pincode }} </h6>
                        <h6>Phone: {{ sp.phone_number }} </h6>
                        <router-link class="btn btn-outline-primary my-2" :to="{name: 'sp_action', params: {id: sp.id} }">Take Action</router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            userData: "",
            userServiceReqs: null,
            serviceReq: {
                "date_of_req": "",
                "serviceID": null,
            },
            allServices: null,
            unverified_serv_profs: null
        }
    },
    mounted() {
        this.loadUser()
        this.loadServices()
        this.unverifiedSP()
        this.loadServiceReq()
    },
    methods: {
        // re_load(){
        //     setTimeout(() => {
        //         window.location.reload(); 
        //     }, 50)
        // },
        createServiceRequest(){
            fetch('/api/service_request/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.serviceReq)
            })
            .then(response => response.json())
            .then(data => {
                this.loadServiceReq()
            })
        },
        loadUser(){
            fetch('/api/admin_home', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.userData = data)
        },
        loadServiceReq(){
            fetch('/api/service_request/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.userServiceReqs = data
            })
        },

        loadServices(){
            fetch('/api/service/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.allServices = data
            })
        },

        unverifiedSP(){
            fetch('/api/serv_prof/get?sp_verified_status=UNVERIFIED', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.unverified_serv_profs = data
            })
        },
        csvExport(){
            fetch('/api/export')
            .then(response => response.json())
            
            .then(data => {
                window.location.href = `/api/csv_result/${data.id}`                
            })
        }
    }
}