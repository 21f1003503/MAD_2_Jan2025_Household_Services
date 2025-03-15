export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px; width:500px;">
                <div class=" mx-auto mt-5 text-center" style="height: 400px; width: 500px;">
                    <div class="card mx-auto">
                        <!--div class="card-title mt-3">
                            <h4>Edit Service Request</h4>
                        </div-->
                         <h4 class="text-center mb-1 mt-3">Edit Service Request</h4>
                        <div class="card-body">
                            <label for="sr_date_of_req">Date of Request:</label><br>
                            <input type="date" id="sr_date_of_req" v-model="sr_date_of_req">
                        </div>
                        <div>
                            <button @click="editSR" class="btn btn-success btn-sm">SUBMIT</button>
                            <router-link class="btn btn-secondary btn-sm" to="/cu_dashboard">No Action</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            sr_date_of_req: null
        }
    },
    methods: {
        editSR(){
            const id = this.$route.params.s_reqID
            fetch(`/api/service_request/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({sr_date_of_req: this.sr_date_of_req})
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                this.$router.push('/cu_dashboard')
            })
        }
    }
}