export default {
    template: `
        <div>
            
            <div v-if="userData.flag == 'RED'"  >
                <div class="col border" style="height: 750px;">
                <h4 class="text-center mt-5">You Have Been RED Flagged By The Admin...</h4>
            </div>
            </div>
            <div v-if="userData.flag == 'GREEN'">
            <h2>Welcome, {{ userData.full_name }}!</h2>
            <div class="row border">
                <div class="col-8 border" style="height: 700px; overflow-y: scroll">
                    <h3 class = "text-center mt-2">CHOOSE YOUR SERVICE</h3>
                    <div class="row row-cols-1 row-cols-md-3 g-4">
                        <div class="col">
                            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#createSalonModal">
                                <img src="static/salon.jpg" class="card-img-top" alt="Salon">
                                <div class="card-body">
                                    <h4 class="card-title text-center">SALON</h4>
                                    <p class="card-text text-center">Offering haircuts, head massages, skincare, and more personalized salon services at home.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#createAppRepairModal">
                            <img src="static/also appliance.avif" class="card-img-top" alt="Appliance">
                            <div class="card-body">
                                <h4 class="card-title text-center">APPLIANCE REPAIR</h4>
                                <p class="card-text text-center">Specialized in repairing ACs, kitchen appliances like ovens and microwaves, laundry machines, and more.</p>
                            </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#cleaningModal">
                            <img src="static/also cleaner bw.avif" class="card-img-top" alt="Cleaning">
                            <div class="card-body">
                                <h4 class="card-title text-center">CLEANING</h4>
                                <p class="card-text text-center">Comprehensive cleaning services for full home, kitchen, washroom, and more tailored needs.</p>
                            </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#createCarpentryModal">
                                <img src="static/also carpenter.avif" class="card-img-top" alt="Carpentry">
                                <div class="card-body">
                                    <h4 class="card-title text-center">CARPENTER</h4>
                                    <p class="card-text text-center">Expert in furniture assembly, repairs, custom carpentry, and a variety of home carpentry solutions.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#createPlumbingModal">
                                <img src="static/also plumbing bw.avif" class="card-img-top" alt="Salon">
                                <div class="card-body">
                                    <h4 class="card-title text-center">PLUMBING</h4>
                                    <p class="card-text text-center">Experienced in washroom and kitchen plumbing, appliance installations, and more plumbing solutions.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card h-100" data-bs-toggle="modal" data-bs-target="#createElectricalModal">
                            <img src="static/also electrical.avif" class="card-img-top" alt="Electrical">
                            <div class="card-body">
                                <h4 class="card-title text-center">ELECTRICAL</h4>
                                <p class="card-text text-center">Expert in wiring, appliance setup, lighting, and a range of home electrical solutions.</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4 border" style="height: 700px; overflow-y: scroll">
                    <h3 class="text-center mt-2">Your Service Requests</h3>
                    <div v-for="s in userServiceReqs" class = "card mt-2" v-if="s.s_reqID">
                        
                        <div class="card-body">
                            <h5 class="card-title">#{{ s.s_reqID }}  {{ s.service_name}}
                                    <span v-if="s.service_status =='REQUESTED'" class="badge rounded-pill text-bg-danger">
                                        {{ s.service_status }}
                                    </span>
                                    <span v-if="s.service_status =='ASSIGNED'" class="badge rounded-pill text-bg-warning">
                                        {{ s.service_status }}
                                    </span>
                                    <span v-if="s.service_status =='CLOSED'" class="badge rounded-pill text-bg-success">
                                        {{ s.service_status }}
                                    </span>
                            </h5>

                            <h6 class="card-text">Created on:   {{s.date_of_request}}</h6>
                            <h6 v-if="s.service_status == 'CLOSED'" class="card-text">Completed on: {{s.date_of_completion}}</h6>
                            <h6 class="card-text">Cost: ₹ {{s.service_price}}</h6>
                            <h6 v-if="s.service_status == 'CLOSED'" class="card-text">Performed by: ID {{s.service_professional}}</h6>
                            <h6 v-if="s.service_status == 'ASSIGNED'" class="card-text">Assigned by: ID {{s.service_professional}}</h6>
                            <h6 v-if="s.service_status == 'CLOSED'" class="card-text">
                                <div v-if="s.complaints && s.complaints.length > 0">
                                    <div v-for="complaint in s.complaints" :key="complaint.complaintID">
                                        <div v-if="complaint.complaint_status == 'PENDING'">
                                            <button class="btn btn-secondary btn-sm" disabled>COMPLAINT PENDING</button>
                                        </div>
                                        <div v-else-if="complaint.complaint_status == 'RESOLVED'">
                                            <button class="btn btn-primary btn-sm" disabled>COMPLAINT RESOLVED</button>
                                        </div>
                                    </div>
                                </div>

                                <!--div v-else>
                                    <router-link class="btn btn-outline-warning btn-sm" 
                                        :to="{ name: 'reg_complaint', params: { s_reqID: s.s_reqID } }">
                                        REGISTER COMPLAINT
                                    </router-link>
                                </div-->
                            </h6>

                            <!--h6 v-if="s.service_status == 'CLOSED'" class="card-text"-->
                                
                                <!--div v-if="cu_complaints.some(comp => comp.s_reqID === s.s_reqID)">
                                    <div v-for="comp in cu_complaints" :key="comp.complaintID">
                                        <div v-if="comp.s_reqID === s.s_reqID">
                                            <div v-if="comp.complaint_status === 'PENDING'">
                                                <button class="btn btn-secondary btn-sm" disabled>COMPLAINT PENDING</button>
                                            </div>
                                            <div v-else-if="comp.complaint_status === 'RESOLVED'">
                                                <button class="btn btn-primary btn-sm" disabled>{{ comp.result }}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div-->

                                <!--h6 v-if="s.service_status == 'CLOSED'" class="card-text">
                                    <div v-for="comp in cu_complaints" v-if="comp.s_reqID == s.s_reqID">
                                        <div v-if="comp.complaint_status == 'PENDING'">
                                            <button class="btn btn-secondary btn-sm" disabled>COMPLAINT PENDING</button>
                                        </div>
                                        <div v-else-if="comp.complaint_status == 'RESOLVED">
                                            <button class="btn btn-primary btn-sm" disabled>COMPLAINT RESOLVED</button>
                                        </div>
                                    </div>


                                <router-link class="btn btn-outline-warning btn-sm" :to="{name: 'reg_complaint', params: {s_reqID: s.s_reqID} }">REGISTER COMPLAIN</router-link>
                            </h6-->

                                
                                <div v-if="s.service_status == 'CLOSED'">
                                    <div v-for="comp in cu_complaints">
                                        <div v-if="comp.s_reqID == s.s_reqID">
                                            <!--div v-else-->
                                            <div v-if="comp.complaint_status == 'PENDING'">
                                                <button class="btn btn-secondary btn-sm" disabled>COMPLAINT PENDING</button>
                                            </div>
                                            <div v-if="comp.complaint_status == 'RESOLVED'">
                                                <button class="btn btn-primary btn-sm" disabled>COMPLAINT RESOLVED</button>
                                            </div>
                                        </div>
                                        <!--div v-else>
                                            <router-link 
                                                class="btn btn-outline-warning btn-sm"
                                                :to="{ name: 'reg_complaint', params: { s_reqID: s.s_reqID } }">
                                                REGISTER COMPLAINT
                                            </router-link>
                                        </div-->    
                                    </div>
                                </div>

                                
                            <!--/h6-->

                            <h6 v-if="s.service_status == 'ASSIGNED'" class="card-text">
                                <router-link class="btn btn-success btn-sm" :to="{name: 'close_sr', params: {s_reqID: s.s_reqID} }">CLOSE</router-link>
                            </h6>

                            <h6 v-if="s.service_status == 'REQUESTED'" class="card-text">
                                <!--router-link class="btn btn-outline-primary btn-sm" :to="{name: 'edit_sr', params: {s_reqID: s.s_reqID} }">EDIT</router-link-->
                                <button @click="deleteSR(s.s_reqID)" class = "btn btn-outline-danger btn-sm">DELETE</button>
                            </h6>
                        </div>
                    </div>
                    <div v-else class="text-center mt-5">
                        <strong>No Service Requests Created Yet...</strong>
                    </div>
                </div>

                <div class="modal fade" id="closeSRLabel" tabindex="-1" aria-labelledby="closeSRModal" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="closeSRLabel">Modal title</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="date_of_completion" class="form-label">Date of Completion:</label>
                                    <input type="date" class="form-control" id="date_of_completion" v-model="closeSR.date_of_completion" required>
                                </div>
                                <div class="mb-3">
                                    <label for="remarks" class="form-label">Remarks:</label>
                                    <input type="text" class="form-control" id="remarks" v-model="closeSR.remarks" required>
                                </div>
                                <div class="mb-3">
                                    <label for="rating" class="form-label">Rating:</label>
                                    <input type="text" class="form-control" id="rating" v-model="closeSR.rating" required>
                                </div>
                            </div>
                            <div class="modal-footer">
                                
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button @click="closeServiceRequest()" data-bs-dismiss="modal" class="btn btn-success">CLOSE</button>
                            
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="createSalonModal" tabindex="-1" aria-labelledby="salonModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="salonModalLabel">Salon Request</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="date_of_req" class="form-label">Date:</label>
                                    <input type="date" class="form-control" id="date" v-model="serviceReq.date_of_req" required>
                                </div>

                                <div class="mb-3">
                                    <label for="serviceID" class="form-label">Service:</label>
                                    <select class="form-select" aria-label="Select A Service:" v-model="serviceReq.serviceID" id="serviceID" type=number>
                                        <option v-for="service in services_salon" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }} - ₹{{ service.service_price }}
                                        </option>
                                    </select>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button @click="createServiceRequest" data-bs-dismiss="modal" class="btn btn-primary">Create</button>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="createElectricalModal" tabindex="-1" aria-labelledby="electricalModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="electricalModalLabel">Electrical Request</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="date_of_req" class="form-label">Date:</label>
                                    <input type="date" class="form-control" id="date" v-model="serviceReq.date_of_req" required>
                                </div>

                                <div class="mb-3">
                                    <label for="serviceID" class="form-label">Service:</label>
                                    <select class="form-select" aria-label="Select A Service:" v-model="serviceReq.serviceID" id="serviceID" type=number>
                                        <option v-for="service in services_electrical" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }} - ₹{{service.service_price}}
                                        </option>
                                    </select>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button @click="createServiceRequest" data-bs-dismiss="modal" class="btn btn-primary">Create</button>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="createCarpentryModal" tabindex="-1" aria-labelledby="carpentryModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="carpentryModalLabel">Carpentry Request</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="date_of_req" class="form-label">Date:</label>
                                    <input type="date" class="form-control" id="date" v-model="serviceReq.date_of_req" required>
                                </div>

                                <div class="mb-3">
                                    <label for="serviceID" class="form-label">Service:</label>
                                    <select class="form-select" aria-label="Select A Service:" v-model="serviceReq.serviceID" id="serviceID" type=number>
                                        <option v-for="service in services_carpentry" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }} - ₹{{service.service_price}}
                                        </option>
                                    </select>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button @click="createServiceRequest" data-bs-dismiss="modal" class="btn btn-primary">Create</button>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="createPlumbingModal" tabindex="-1" aria-labelledby="plumbingModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="plumbingModalLabel">Plumbing Request</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="date_of_req" class="form-label">Date:</label>
                                    <input type="date" class="form-control" id="date" v-model="serviceReq.date_of_req" required>
                                </div>

                                <div class="mb-3">
                                    <label for="serviceID" class="form-label">Service:</label>
                                    <select class="form-select" aria-label="Select A Service:" v-model="serviceReq.serviceID" id="serviceID" type=number>
                                        <option v-for="service in services_plumbing" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }} - ₹{{service.service_price}}
                                        </option>
                                    </select>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button @click="createServiceRequest" data-bs-dismiss="modal" class="btn btn-primary">Create</button>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="createAppRepairModal" tabindex="-1" aria-labelledby="appRepairModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="appRepairModalLabel">Appliance Repair Request</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="date_of_req" class="form-label">Date:</label>
                                    <input type="date" class="form-control" id="date" v-model="serviceReq.date_of_req" required>
                                </div>

                                <div class="mb-3">
                                    <label for="serviceID" class="form-label">Service:</label>
                                    <select class="form-select" aria-label="Select A Service:" v-model="serviceReq.serviceID" id="serviceID" type=number>
                                        <option v-for="service in services_appliance_repair" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }} - ₹{{service.service_price}}
                                        </option>
                                    </select>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button @click="createServiceRequest" data-bs-dismiss="modal" class="btn btn-primary">Create</button>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="cleaningModal" tabindex="-1" aria-labelledby="cleaningModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="cleaningModalLabel">Cleaning Request</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="date_of_req" class="form-label">Date:</label>
                                    <input type="date" class="form-control" id="date" v-model="serviceReq.date_of_req" required>
                                </div>

                                <div class="mb-3">
                                    <label for="serviceID" class="form-label">Service:</label>
                                    <select class="form-select" aria-label="Select A Service:" v-model="serviceReq.serviceID" id="serviceID" type=number>
                                        <option v-for="service in services_cleaning" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }} - ₹{{service.service_price}}
                                        </option>
                                    </select>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button @click="createServiceRequest" data-bs-dismiss="modal" class="btn btn-primary">Create</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>`,
    data: function(){
        return {
            userData: "",
            userServiceReqs: null,
            serviceReq: {
                "date_of_req": "",
                "serviceID": null,
            },
            services_cleaning: null,
            services_electrical: null,
            services_plumbing: null,
            services_salon: null,
            services_appliance_repair: null,
            services_carpentry: null,
            closeSR: {
                "date_of_completion": "",
                "remarks": "",
                "rating": ""
            },
            cu_complaints: null
        }
    },
    mounted() {

        this.loadUser()
        this.loadServiceReq()
        this.customerComplaints()

        fetch('/api/service/get/cleaning', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.services_cleaning = data
        })

        fetch('/api/service/get/electrical', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.services_electrical = data
        })

        fetch('/api/service/get/plumbing', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.services_plumbing = data
        })

        fetch('/api/service/get/salon', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.services_salon = data
        })

        fetch('/api/service/get/carpentry', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.services_carpentry = data
        })

        fetch('/api/service/get/appliance_repair', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.services_appliance_repair = data
        })
    },
    methods: {
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
            fetch('/api/cu_home', {
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
        closeServiceRequest(s_reqID){
            fetch(`/api/customer/close_service_request/${s_reqID}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.closeSR)
            })
            .then(response => response.json())
            .then(data => setTimeout(() => {window.location.reload()}, 50))
        },
        deleteSR(s_reqID){
            fetch(`/api/delete_service_req/${s_reqID}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
            })
            .then(response => response.json())
            .then(data => setTimeout(() => {window.location.reload()}, 50))
        },
        customerComplaints(){
            fetch('/api/complaints/get', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.cu_complaints = data
            })
        }
    }
}