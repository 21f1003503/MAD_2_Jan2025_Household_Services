export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px;">
                
                <router-link to="/admin_dashboard"><h2 class="text-center mt-2">Customers</h2></router-link>
                <div class="mt-2 mx-auto text-center" style="width: 1200px;">
                    <table class="table table-hover table-striped table-bordered table-warning">
                        <thead class="table-primary">
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Username</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Flag</th>
                            <th scope="col">Pincode</th>
                            <th scope="col">Phone Number</th>
                            
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                        
                        <tbody v-for="customer in all_customers" v-if="customer.pincode">
                            <tr>
                                <th scope="row">{{ customer.id }}</th>
                                <td>{{ customer.username}}</td>
                                <td>{{ customer.full_name }}</td>
                                <td>{{ customer.cu_address }}</td>
                                <td>{{ customer.flag }}</td>
                                <td>{{ customer.pincode }}</td>
                                <td>{{ customer.phone_number }}</td>
                                
                                <td>
                                    <div v-if="customer.flag == 'GREEN'">
                                        <button @click="flagUser(customer.id)" class="btn btn-danger btn-sm">FLAG</button>
                                    </div>
                                    <div v-if="customer.flag == 'RED'">
                                        <button @click="flagUser(customer.id)" class="btn btn-success btn-sm">UNFLAG</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            all_customers: null
        }
    },
    mounted() {
        this.allCustomers()
    },
    methods: {
        allCustomers(){
            fetch('/api/customer/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                this.all_customers = data
            })
        },
        flagUser(id){
            fetch(`/api/flag_user/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                setTimeout(() => {
                    window.location.reload(); 
                }, 50); 
            })
        }
    },
    
}