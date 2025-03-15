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
                        <button @click="closeServiceRequest" class="btn btn-success btn-sm">CLOSE</button>
                        <router-link class="btn btn-danger btn-sm" to="/customer_dashboard">Dont Close</router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    mounted() {
        this.loadServiceReq()
    },
    data() {
        return {
            closeSR: {
                "date_of_completion": "",
                "remarks": "",
                "rating": ""
            },
            date_of_req: ""
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
        }
    },
}