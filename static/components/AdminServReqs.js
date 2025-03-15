export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px;">
                
                <router-link to="/admin_dashboard"><h2 class="text-center mt-2">All Service Requests</h2></router-link>
                <div class="mt-2 mx-auto text-center" style="width: 1200px; ">
                    <table class="table table-hover table-striped table-bordered table-warning">
                        <thead class="table-primary">
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Service ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Service Professional</th>
                            <th scope="col">Date of Request</th>
                            <th scope="col">Date of Completion</th>
                            <th scope="col">Remarks</th>
                            <th scope="col">Rating</th>
                            </tr>
                        </thead>
                        
                        <tbody v-for="sr in userServiceReqs">
                            <tr>
                                <th scope="row">{{ sr.s_reqID }}</th>
                                <td>{{ sr.serviceID }}</td>
                                <td>{{ sr.customer }}</td>
                                <td>{{ sr.service_professional }}</td>
                                <td>{{ sr.date_of_request }}</td>
                                <td>{{ sr.date_of_completion }}</td>
                                <td>{{ sr.remarks }}</td>
                                <td>{{ sr.rating }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            userServiceReqs: null,
        }
    },
    mounted() {
        this.loadServiceReq()
    },
    methods: {
        loadServiceReq(){
            fetch('/api/service_request/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.userServiceReqs = data
            })
        }
    },
}