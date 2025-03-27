export default {
    template: `
        <div class="row ">
            <div class="col" style="height: 723px; overflow-y: scroll;"">
                <h2 class="text-center mt-2">All Service Requests</h2>
                <div class="mt-2 mx-auto text-center" style="width: 1250px; ">
                    <table class="table table-hover table-striped table-bordered table-warning">
                        <thead class="table-primary">
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Request ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Service Name</th>
                            <th scope="col">Service Price</th>
                            <th scope="col">Service Professional</th>
                            <th scope="col">Date of Request</th>
                            <th scope="col">Customer Address</th>
                            <th scope="col">Customer Pincode</th>
                            <th scope="col">Customer Contact</th>
                            <th scope="col">Request Status</th>
                            <th scope="col">Service Status</th>
                            </tr>
                        </thead>
                        
                        <tbody v-for="sr in servReqStatusData">
                            <tr>
                                <th scope="row">{{ sr.s_req_statusID }}</th>
                                <td>{{ sr.s_reqID }}</td>
                                <td>{{ sr.customer }}</td>
                                <td>{{ sr.service_name }}</td>
                                <td>{{ sr.service_price }}</td>
                                <td>{{ sr.spID }}</td>
                                <td>{{ sr.date_of_req }}</td>
                                <td>{{ sr.cu_address }}</td>
                                <td>{{ sr.cu_pincode }}</td>
                                <td>{{ sr.customer_contact }}</td>
                                <td>{{ sr.status }}</td>
                                <td>{{ sr.service_status }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            servReqStatusData: null,
        }
    },
    mounted() {
        this.loadServiceReq()
    },
    methods: {
        loadServiceReq(){
            fetch('/api/serv_req_status/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.servReqStatusData = data
            })
        }
    },
}