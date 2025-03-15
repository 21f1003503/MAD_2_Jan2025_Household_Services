export default {
    template: `
        <div class="row border">
            <div class="col-8 border" style="height: 750px; overflow-y: scroll">
                <div class="text-center mt-3 ">
                    <button @click="create_csv" class="btn btn-outline-primary">Download Service Data</button>
                    </div>
                <div class="border mx-auto mt-3">
                    
                    <h2 class="text-center mt-2">EXISTING SERVICES</h2>
                    <!-- div v-for="service in allServices">
                        <p>{{ service.service_name }}</p>
                    </div -->

                    <div v-for="service in allServices" v-if="service.serviceID" class="card mt-2">
                        <div class="card-header">
                            {{ service.category }}
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">#{{ service.serviceID }}: {{ service.service_name }}</h4>
                            <h6 class="card-text">About: {{ service.service_desc }}</h6>
                            <h6 class="card-text">Price: INR {{ service.service_price }}</h6>
                            <h6 class="card-text">Category: {{ service.category }}</h6>
                            <h6 class="card-text">Sub Category: {{ service.sub_category }}</h6>
                            <router-link class="btn btn-outline-primary btn-sm" :to="{name: 'update_service', params: {serviceID: service.serviceID}}">EDIT</router-link>
                            <button @click="deleteService(service.serviceID)" class = "btn btn-outline-danger btn-sm">DELETE</button>
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
        async create_csv(){
            const res = await fetch('http://127.0.0.1:5000/create_csv')
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => { 
                const res = await fetch(`http://127.0.0.1:5000/getCSV/${task_id}`)}, 100)

            if(res.ok){
                console.log('data is ready')
                window.open(`http://127.0.0.1:5000/getCSV/${task_id}`)
                clearInterval(interval)
            }
            
        },
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
        deleteService(serviceID){
            fetch(`/api/delete_service/${serviceID}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
            })
            .then(response => response.json())
            .then(data => setTimeout(() => {window.location.reload()}, 50))
        }
    }
}