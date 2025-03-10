export default {
    template: `
        <div>
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
                            <div class="card h-100">
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
                            <div class="card h-100">
                                <img src="static/also carpenter.avif" class="card-img-top" alt="Salon">
                                <div class="card-body">
                                    <h4 class="card-title text-center">CARPENTER</h4>
                                    <p class="card-text text-center">Expert in furniture assembly, repairs, custom carpentry, and a variety of home carpentry solutions.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card h-100">
                                <img src="static/also plumbing bw.avif" class="card-img-top" alt="Salon">
                                <div class="card-body">
                                    <h4 class="card-title text-center">PLUMBING</h4>
                                    <p class="card-text text-center">Experienced in washroom and kitchen plumbing, appliance installations, and more plumbing solutions.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <div class="card h-100">
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
                    <h3 class="text-center">Your Service Requests</h3>
                    <div v-for="s in userServiceReqs" class = "card mt-2">
                        <div class="card-body">
                            <h5 class="card-title">#{{ s.s_reqID }} - {{ s.service_name}}
                                    <span class="badge rounded-pill text-bg-danger">
                                        {{ s.service_status }}
                                    </span>
                                
                            </h5>

                            <p class="card-text">Created on:   {{s.date_of_request}}</p>
                            <p v-if="s.service_status == 'CLOSED'" class="card-text">Completed on: {{s.date_of_completion}}</p>
                            <p class="card-text">Cost:         {{s.service_price}}</p>
                            <p v-if="s.service_status == 'ASSIGNED'" class="card-text">Performed by: {{s.spID}}</p>

                            <p v-if="s.service_status == 'ASSIGNED'" class="card-text">
                                <button class = "btn btn-success">CLOSE</button>
                            </p>

                            <p v-if="s.service_status == 'REQUESTED'" class="card-text">
                                <button class = "btn btn-outline-primary">EDIT</button>
                                <button class = "btn btn-outline-danger">DELETE</button>
                            </p>
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
                                            #{{ service.serviceID }} {{ service.service_name }}
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
                                            #{{ service.serviceID }} {{ service.service_name }}
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
            services_carpentry: null
        }
    },
    mounted() {

        this.loadUser()
        this.loadServiceReq()

        fetch('/api/service/get/Cleaning', {
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

        fetch('/api/service/get/Salon', {
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
        }
    }
}