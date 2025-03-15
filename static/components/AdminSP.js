export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px; overflow-x: scroll; overflow-y: scroll"">
                <router-link to="/admin_dashboard"><h2 class="text-center mt-2">Service Professionals</h2></router-link>
                <div class="mt-2 mx-auto text-center" style="width: 1400px;">
                    <table class="table table-hover table-striped table-bordered table-warning">
                        <thead class="table-primary">
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Username</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Flag</th>
                            <th scope="col">Pincode</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Complaint Against</th>
                            <th scope="col">Service ID</th>
                            <th scope="col">Experience</th>
                            <th scope="col">Verified Status</th>
                            <th scope="col">Availability</th>
                            <th scope="col">Avg Rating</th>
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody v-for="sp in all_serv_profs" v-if="sp.pincode">
                            <tr>
                                <th scope="row">{{ sp.id }}</th>
                                <td>{{ sp.username }}</td>
                                <td>{{ sp.full_name }}</td>
                                <td>{{ sp.flag }}</td>
                                <td>{{ sp.pincode }}</td>
                                <td>{{ sp.phone_number }}</td>
                                <td>{{ sp.complaint_against }}</td>
                                <td>{{ sp.serviceID }}</td>
                                <td>{{ sp.sp_experience }}</td>
                                <td>{{ sp.sp_verified_status }}</td>
                                <td>{{ sp.sp_availability }}</td>
                                <td>{{ sp.sp_avg_rating }}</td>
                                <td><router-link class="btn btn-outline-primary my-2 btn-sm" :to="{name: 'sp_action', params: {id: sp.id} }">Take Action</router-link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            all_serv_profs: null
        }
    },
    mounted() {
        this.allSP()
    },
    methods: {
        allSP(){
            fetch('/api/serv_prof/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                this.all_serv_profs = data
            })
        }
    },
}