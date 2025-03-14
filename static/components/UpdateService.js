export default {
    template: `
        <div class="row border">
            <div class="col text-center" style="height: 750px;">
                <h3 class="text-center mt-2">UPDATE SERVICE</h3>
                <div class="card text-center mx-auto" style="width: 700px;">
                <div class="card-body text-center mx-auto" style="width: 600px;">
                    <div class="mb-3 text-center">
                        <label for="category" class="form-label">Category:</label><br>
                        <input type="text" class="form-control" aria-label="Select Category" id="category" v-model="serviceData.category" readonly>
                    </div>

                    <div class="mb-3 mt-2">
                        <label for="sub_category" class="form-label">Sub Category:</label><br>
                        <input type="text" class="form-control" id="sub_category" v-model="serviceData.sub_category" readonly>
                    </div>

                    <div class="mb-3 mt-2">
                        <label for="service_price" class="form-label">Original Price: </label>
                        <input type="number" class="form-control" id="service_price" v-model="serviceData.service_price" readonly><br>
                        <label for="service_price" class="form-label">New Price: </label>
                        <input type="number" class="form-control" id="service_price" v-model="serviceChanges.service_price" placeholder="Enter New Price If You Wish To Edit This Field...">
                    </div>

                    <div class="mb-3 mt-2">
                        <label for="service_desc" class="form-label">Original Description:</label><br>
                        <textarea class="form-control" id="service_desc" v-model="serviceData.service_desc"></textarea><br>
                        <label for="service_desc" class="form-label">New Description:</label><br>
                        <textarea class="form-control" id="service_desc" v-model="serviceChanges.service_desc" placeholder="Enter New Description If You Wish To Edit This Field..."></textarea>
                    </div>

                    <button @click="updateService" class="btn btn-primary">Update</button>
                </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            serviceData: {},
            serviceChanges: {
                "service_price": null,
                "service_desc": ""
            }
        }
    },
    mounted() {
        this.loadServices()
    },
    methods: {
        loadServices(){
            const serviceID = this.$route.params.serviceID;
            fetch(`/api/service/get/${serviceID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.serviceData = data
            })
        },
        updateService(){
            const serviceID = this.$route.params.serviceID;
            fetch( `/api/service/update/${serviceID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.serviceChanges)
            })
            .then(response => response.json())
            .then(this.$router.push('/admin/services'))
        }
    }
}