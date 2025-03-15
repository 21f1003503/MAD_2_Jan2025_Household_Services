export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px; width:500px;">
                <div class="card mx-auto mt-5 text-center" style="height: 600px; width: 500px;">
                    <div class="text-center mx-auto">
                        <div class="card-title mt-3">
                            <h4>Edit Service Request</h4>
                        </div>
                         <!--h4 class="text-center mb-1 mt-3">Register Complaint</h4-->
                        <!--div class="card-body">
                            <label for="s_reqID">Service Request ID:</label><br>
                            <input type="number" id="s_reqID" v-model="srData.s_reqID" placeholder="userServiceReqs.s_reqID">
                        </div-->
                        <div class="card-body text-center mx-2 mb-3">
                            <label for="s_reqID" class="form-label">Service Request ID:</label>
                            <input type="number" class="form-control" id="s_reqID" v-model="srData.s_reqID" disabled readonly>
                        </div>

                        <div class=" card-body mx-2 mb-3">
                            <label for="complaint_by" class="form-label">Complaint From:</label>
                            <input type="number" class="form-control" id="complaint_by" v-model="srData.complaint_by"  disabled readonly>
                        </div>

                        <div class=" card-body mx-2 mb-3">
                            <label for="complaint_on" class="form-label">Complaint Against:</label>
                            <input type="number" class="form-control" id="complaint_on" v-model="srData.complaint_on"  disabled readonly>
                        </div>

                        <div class=" card-body mx-2 mb-3">
                            <label for="complaint_desc" class="form-label">Complaint Remarks:</label>
                            <textarea class="form-control" id="complaint_desc" v-model="srData.complaint_desc"></textarea>
                        </div>

                        <div>
                            <button @click="registerComplaint(srData.s_reqID)" class="btn btn-success btn-sm">SUBMIT</button>
                            <router-link class="btn btn-secondary btn-sm" to="/cu_dashboard">No Action</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            srData: {
                s_reqID: "",
                complaint_by: "",
                complaint_on: "",
                complaint_desc: ""
            },
            userData: "",
            userServiceReqs: null
        }
    },
    mounted() {
        this.loadUser()
        this.loadServiceReq()
    },
    methods: {
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
                this.$router.push('/cu_dashboard')
            })
        }
    },
}