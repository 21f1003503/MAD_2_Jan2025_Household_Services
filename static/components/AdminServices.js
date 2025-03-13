export default {
    template: `
        <div class="row border">
            <div class="col-8 border" style="height: 750px; overflow-y: scroll">
                <div class="border mx-auto mt-5">
                    <h2 class="text-center mt-2">EXISTING SERVICES</h2>
                    <!-- div v-for="service in allServices">
                        <p>{{ service.service_name }}</p>
                    </div -->

                    <div v-for="service in allServices" class="card mt-2">
                        <div class="card-header">
                            {{ service.category }}
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">{{ service.service_name }}</h4>
                            <p class="card-text">About: {{ service.service_desc }}</p>
                            <p class="card-text">Price: INR {{ service.service_price }}</p>
                            <a href="#" class="btn btn-outline-primary">Edit</a>
                            <a href="#" class="btn btn-outline-danger">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 border" style="height: 750px; overflow-y: scroll">
                <h3 class="text-center mt-2">CREATE SERVICE</h3>
                <div class="mb-3">
                    <label for="category" class="form-label">Category:</label><br>
                    <select class="form-select" aria-label="Select Category" id="category" v-model="newService.category" required>
                        <option selected>Select A Category</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="salon">Salon</option>
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="appliance_repair">Appliance Repair</option>
                        <option value="carpentry">Carpentry</option>
                    </select>

                    <div class="mb-3 mt-2">
                        <label for="sub_category" class="form-label">Sub Category:</label><br>
                        <input type="text" class="form-control" id="sub_category" v-model="newService.sub_category" placeholder="Enter Sub Category" required>
                    </div>

                    <div class="mb-3 mt-2">
                        <label for="service_price" class="form-label">Price:</label><br>
                        <input type="number" class="form-control" id="service_price" v-model="newService.service_price" placeholder="Enter Price" required>
                    </div>

                    <div class="mb-3 mt-2">
                        <label for="service_desc" class="form-label">Description:</label><br>
                        <textarea class="form-control" id="service_desc" v-model="newService.service_desc" placeholder="Enter Description" required></textarea>
                    </div>

                    <button @click="createService" class="btn btn-primary">Create</button>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            userData: "",
            allServices: null,
            newService: {
                "category": "",
                "sub_category": "",
                "service_price": null,
                "service_desc": "",
                "service_name": ""
            },
        }
    }, 
    mounted() {
            this.loadUser()
            this.loadServices()
            
    },
    methods: {
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
        createService(){
            fetch('/api/service/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.newService)
            })
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    window.location.reload(); 
                }, 50);
                this.loadServices()
            })
        },
    }
}