export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px; width:500px;">
                <div class=" mx-auto mt-5 text-center" style="height: 600px; width: 500px;">
                    <div class="card mx-auto" style="height: 300px;">
                        <h4 class="text-center mb-1 mt-3">Create Service Request</h4>
                        <div class="card-body">
                            <div class="mb-3">
                                    <label for="date_of_req" class="form-label">Date:</label>
                                    <input type="date" class="form-control" id="date" v-model="serviceReq.date_of_req" required>
                            </div>

                            <div class="mb-3">
                                <label for="serviceID" class="form-label">Service:</label>
                                <select class="form-select" aria-label="Select A Service:" v-model="serviceReq.serviceID" id="serviceID" type=number>
                                    <option v-for="service in allServices" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }} - ₹{{service.service_price}}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="card-footer text-body-secondary">
                            <button @click="createServiceRequest" class="btn btn-success btn-sm">CREATE</button>
                            <router-link class="btn btn-secondary btn-sm" to="/cu_dashboard">No Action</router-link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            userData: "",
            allServices: null,
            serviceReq: {
                "date_of_req": "",
                "serviceID": null,
            }
        }
    },
    mounted() {
        this.loadUser()
        this.loadServices()
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
                if (response.ok) {
                    alert("Service request created successfully!");
                    this.$router.push('/cu_dashboard');
                } else {
                    alert(data.message || "Failed to create service request. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error creating service request:", error);
                alert("An error occurred. Please try again later.");
            });
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
    }
}