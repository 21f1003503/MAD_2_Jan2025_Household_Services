export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px;">
                
                <router-link to="/admin_dashboard"><h2 class="text-center mt-2">Complaints</h2></router-link>
                <div class="mt-2 mx-auto text-center" style="width: 1200px;">
                    <table class="table table-hover table-striped table-bordered table-warning">
                        <thead class="table-primary">
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Service Req ID</th>
                            <th scope="col">By</th>
                            <th scope="col">Against</th>
                            <th scope="col">Issue</th>
                             <th scope="col">Status</th>
                            <th scope="col">Result</th>
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                        
                        <tbody v-for="c in all_complaints">
                            <tr>
                                <th scope="row">{{ c.complaintID }}</th>
                                <td>{{ c.s_reqID}}</td>
                                <td>{{ c.complaint_by }}</td>
                                <td>{{ c.complaint_on }}</td>
                                <td>{{ c.complaint_desc }}</td>
                                <td>{{ c.complaint_status }}</td>
                                <td>{{ c.result }}</td>
                                <td>
                                    <div v-if="c.complaint_status == 'PENDING'">
                                        <button @click="dontFlagUser(c.complaintID)" class="btn btn-success btn-sm">DONT FLAG</button>
                                        <button @click="flagUser(c.complaintID)" class="btn btn-danger btn-sm">FLAG</button>
                                    </div>
                                    <div v-if="c.complaint_status == 'RESOLVED'">
                                        <button class="btn btn-secondary btn-sm" disabled>RESOLVED</button>
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
            all_complaints: null
        }
    },
    mounted() {
        this.allComplaints()
    },
    methods: {
        allComplaints(){
            fetch('/api/complaints/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                this.all_complaints = data
            })
        },
        flagUser(compID){
            fetch( `/api/resolve_complaint/${compID}/RED`, {
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
        },
        dontFlagUser(compID){
            fetch( `/api/resolve_complaint/${compID}/GREEN`, {
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