export default {
    template: `
        <div class="row " style="background-color: #e3f2fd;">
        
            <div class="col-4  fs-2">
                <i class="bi bi-facebook"></i>
                <!--i class="bi bi-house-door"></i-->
                    FixItNow
            </div>

            <div class="col-3">
                <!--i class="bi bi-house-door"></i-->
                <div v-if="loggedIn && userRoles.includes('admin')">
                    <ul class="nav nav-pills mt-2">
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/admin_dashboard"><i class="bi bi-house-door"></i></router-link>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown"  role="button" aria-expanded="false">Admin</a>
                            <ul class="dropdown-menu">
                                <li><router-link class="dropdown-item" to="/admin/services">Services</router-link></li>
                                <li><router-link class="dropdown-item" to="/admin/service_requests">Service Requests</router-link></li>
                                <li><router-link class="dropdown-item" to="/admin/customers">Customers</router-link></li>
                                <li><router-link class="dropdown-item" to="/admin/service_professionals">Service Professionals</router-link></li>
                                <li><router-link class="dropdown-item" to="/admin/complaints">Conflicts</router-link></li>
                                <li><router-link class="dropdown-item" to="/admin/service_request_status">Service Request Status</router-link></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <button @click="csvExport" class="btn btn-warning btn-sm my-1">Download CSV</button>
                        </li>  
                    </ul>
                </div>
                <div v-if="loggedIn && userRoles.includes('customer') && !userRoles.includes('admin')">
                    <ul class="nav nav-pills mt-2">
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/cu_dashboard"><i class="bi bi-house-door"></i> Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/cu_profile"><i class="bi bi-person-circle"></i> {{ userUsername }}</router-link>
                        </li>
                    </ul>
                </div>
                <div v-if="loggedIn && userRoles.includes('service_professional') && !userRoles.includes('admin')">
                    <ul class="nav nav-pills mt-2">
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/sp_dashboard"><i class="bi bi-house-door"></i> Home</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="col-3 ">
                <form class = "d-flex">
                    <div v-if="loggedIn" class="col-auto mt-2">
                        <label for="search_bar" class="visually-hidden">Search</label>
                        <input type="text" class="form-control" id="search_bar" v-model="search_query.term" placeholder="Search">
                    </div>
                    <div v-if="loggedIn" class="col-auto mt-2 my-2">
                        <button @click="search" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#searchModal">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </form>
            </div>
            <div class="col-2 ">
                <div v-if="!loggedIn" class="mt-1 text-center">
                    <router-link class="btn btn-primary my-1" to="/login">Login</router-link>
                    <router-link class="btn btn-warning my-1" to="/registration">Register</router-link>
                    
                </div>
                <div v-else class="mt-1 text-center">
                    <button @click="log_out" class="btn btn-outline-danger my-1">Logout</button>
                </div>
            </div>

            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="searchModalLabel">Search Results</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="searchRes.length > 0">
                                <ul class="list-group">
                                    <li class="list-group-item" v-for="res in searchRes" :key="res.serviceID">
                                        <div v-if="res.service_desc != 'NA'">
                                            <strong>{{ res.service_name }}</strong> - {{ res.category }}  
                                            <span class="text-muted">₹{{ res.service_price }}</span><br>
                                            <span class="text-muted">{{ res.service_desc }}</span>
                                            <div v-if="userRoles.includes('customer')">
                                                <div v-if="!userRoles.includes('admin')">
                                                    <router-link class="btn btn-outline-primary my-2 btn-sm" :to="{name: 'create_sr'}">Create Service Request</router-link>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="res.service_desc == 'NA'">
                                            <strong>{{ res.username }}</strong><span class="text-muted"> {{ res.full_name }}</span><br>
                                            
                                            <span v-if="res.serviceID != 'NA'" class="text-muted">
                                                Service Professional
                                                <div v-if="userRoles.includes('admin')">
                                                    <router-link class="btn btn-outline-primary my-2 btn-sm" :to="{name: 'sp_action', params: {id: res.userID} }">Take Action</router-link>
                                                </div>
                                            </span>
                                            <span v-if="res.serviceID == 'NA'" class="text-muted">Customer</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div v-else>
                                <p class="text-center text-danger">No Matches Found!</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            loggedIn: localStorage.getItem("auth_token"),
            search_query: {
                term: ""
            },
            searchRes: {
                "serviceID": "",
                "service_name": "",
                "category": "",
                "sub_category": "",
                "service_price": "",
                "service_desc": ""
            },
            userRoles: {},
            userFullName: "",
            userUsername: ""
        }
    },
    mounted() {
        this.userRolesList()
    },
    methods: {
        log_out(){
            localStorage.removeItem("auth_token");
            this.$router.push('/');
            setTimeout(() => {
                window.location.reload(); 
            }, 50); 
        },
        search(event){
            event.preventDefault();
            fetch('/search', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.search_query)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.searchRes = data
            })
        },
        userRolesList(){
            fetch('/api/home', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.userRoles = data.roles
                this.userFullName = data.full_name
                this.userUsername = data.username
            })
        },
        csvExport(){
            fetch('/api/export')
            .then(response => response.json())
            
            .then(data => {
                window.location.href = `/api/csv_result/${data.id}`                
            })
        }
    }
}