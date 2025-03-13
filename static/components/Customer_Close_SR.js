export default {
    template: `
        <div class="row border">
            <div class="col border mx-auto mt-5" style="height: 750px;">
                <h2 class="text-center mb-3 mt-5">Close Service Request</h2>
                <div class="card text-center" >
                    <div class="card-body text-center">
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
                        <button @click="closeServiceRequest" class="btn btn-success btn-sm">CLOSE</button>
                        <router-link class="btn btn-danger btn-sm" to="/customer_dashboard">Dont Close</router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            closeSR: {
                "date_of_completion": "",
                "remarks": "",
                "rating": ""
            }
        }
    },
    methods: {
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
            .then(this.$router.push('/cu_dashboard'))
        }
    },
}