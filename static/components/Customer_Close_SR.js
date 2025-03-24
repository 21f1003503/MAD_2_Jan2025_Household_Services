export default {
    template: `
        <div class="row border">
            <div class="col border mx-auto mt-5" style="height: 750px;">
                <h2 class="text-center mb-3 mt-5">Close Service Request</h2>
                <div class="card text-center" >
                    <div class="card-body text-center">
                        <div class="mb-3">
                            <label for="date_of_completion" class="form-label">Date of Completion:</label>
                            <input type="date" class="form-control" id="date_of_completion" v-model="closeSR.date_of_completion" :min="date_of_req" required>
                        </div>
                        <div class="mb-3">
                                <label for="remarks" class="form-label">Remarks:</label>
                                <input type="text" class="form-control" id="remarks" v-model="closeSR.remarks" required>
                        </div>
                        <div class="mb-3">
                            <label for="rating" class="form-label">Rating:</label>
                            <select class="form-control" id="rating" v-model="closeSR.rating" required>
                                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-outline-warning btn-sm" data-bs-toggle="modal" data-bs-target="#complaintModal">
                                REGISTER COMPLAINT
                            </button>
                            <!--router-link class="btn btn-outline-warning btn-sm" :to="{ name: 'reg_complaint', params: { s_reqID: s_reqID } }">
                                REGISTER COMPLAINT
                            </router-link-->
                        </div>

                        <button @click="closeServiceRequest" class="btn btn-success btn-sm">CLOSE</button>
                        <router-link class="btn btn-danger btn-sm" to="/customer_dashboard">Dont Close</router-link>

                        <div class="modal fade" id="complaintModal" tabindex="-1" aria-labelledby="complaintModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="complaintModalLabel">Register Complaint</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="text-center mx-2 mb-3">
                                            <label for="s_reqID" class="form-label">Service Request ID:</label>
                                            <input type="number" class="form-control" id="s_reqID" v-model="srData.s_reqID" disabled readonly>
                                        </div>

                                        <div class="mx-2 mb-3">
                                            <label for="complaint_by" class="form-label">Complaint From:</label>
                                            <input type="number" class="form-control" id="complaint_by" v-model="srData.complaint_by"  disabled readonly>
                                        </div>

                                        <div class=" mx-2 mb-3">
                                            <label for="complaint_on" class="form-label">Complaint Against:</label>
                                            <input type="number" class="form-control" id="complaint_on" v-model="srData.complaint_on"  disabled readonly>
                                        </div>

                                        <div class="mx-2 mb-3">
                                            <label for="complaint_desc" class="form-label">Complaint Remarks:</label>
                                            <textarea class="form-control" id="complaint_desc" v-model="srData.complaint_desc"></textarea>
                                        </div>

                                        <div>
                                            <button @click="registerComplaint(srData.s_reqID)" class="btn btn-success btn-sm">SUBMIT</button>
                                            <router-link class="btn btn-secondary btn-sm" to="/cu_dashboard">No Action</router-link>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    mounted() {
        this.loadUser()
        this.loadServiceReq()
    },
    data() {
        return {
            closeSR: {
                "date_of_completion": "",
                "remarks": "",
                "rating": ""
            },
            date_of_req: "",
            s_reqID: this.$route.params.s_reqID,
            userServiceReqs: null,
            srData: {
                s_reqID: "",
                complaint_by: "",
                complaint_on: "",
                complaint_desc: ""
            },
            userData: "",
        }
    },
    methods: {
        loadServiceReq(){
            const id = this.$route.params.s_reqID
            fetch(`/api/service_request/get/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.date_of_req = data.date_of_req
                this.userServiceReqs = data
            })
        },
        closeServiceRequest(){
            const id = this.$route.params.s_reqID;
            fetch(`/api/customer/close_service_request/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.closeSR)
            })
            .then(response => response.json())
            this.$router.push('/cu_dashboard');
            setTimeout(() => {
                window.location.reload(); 
            }, 50); 
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
            const s_reqID = this.$route.params.s_reqID
            fetch(`/api/service_request/get/${s_reqID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.srData.complaint_by = data.customerID;
                this.srData.complaint_on = data.spID;
                this.srData.s_reqID = data.s_reqID
            })
        },
        registerComplaint(s_reqID){
            fetch(`/api/complaints/create/${s_reqID}` ,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.srData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                // this.$router.push('/cu_dashboard')
            })
        }
    },
}