export default {
    template: `
        <div class="row ">
            <div class="col bg-light mx-auto " style="height: 723px;">
                <h2 class="text-center mb-3 mt-5">Service Professional</h2>
                <div class="card text-center w-50 mx-auto" :class="{'bg-warning text-black': serv_profs.sp_verified_status === 'VERIFIED', 'bg-danger text-black': serv_profs.sp_verified_status === 'UNVERIFIED'}" :style="{'--bs-bg-opacity': '0.4'}">
                    <div class="card-header">
                        ID: {{ serv_profs.id }}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ serv_profs.full_name }}</h5>
                        <p class="card-text">Username: {{ serv_profs.username }}</p>
                        <p class="card-text">Pincode: {{ serv_profs.pincode }}</p>
                        <p class="card-text">Phone Number: +91 {{ serv_profs.phone_number }}</p>
                        <p class="card-text">Service ID: {{ serv_profs.serviceID }}</p>
                        <p class="card-text">Average Rating: {{ serv_profs.sp_avg_rating }}</p>
                        <p class="card-text">Flag: {{ serv_profs.flag }}</p>
                        <p class="card-text">Experience: {{ serv_profs.sp_experience }} Years</p>
                            <button @click="() => changeSPStatus(serv_profs.id)" v-if="serv_profs.sp_verified_status == 'UNVERIFIED'" class="btn btn-success">VERIFY</button>
                            <button @click="() => changeSPStatus(serv_profs.id)" v-if="serv_profs.sp_verified_status == 'VERIFIED'" class="btn btn-danger">UNVERIFY</button>
                            <button @click="() => changeFlag(serv_profs.id)" v-if="serv_profs.flag == 'RED'" class="btn btn-success">UNFLAG</button>
                            <button @click="() => changeFlag(serv_profs.id)" v-if="serv_profs.flag == 'GREEN'" class="btn btn-danger">FLAG</button>
                            <router-link class="btn btn-primary" to="/admin_dashboard">No Action</router-link>
                    </div>
                    <div class="card-footer text-body-secondary">
                        Verification Status: {{ serv_profs.sp_verified_status }}
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            serv_profs: ""
        }
    },
    mounted() {
        // const id = this.$route.params.id;
        this.currentSP()
    },
    methods: {
        
        currentSP(){
            const id = this.$route.params.id;
            fetch(`/api/serv_prof/get?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.serv_profs = data[0]
            })
        },
        changeSPStatus(id){
            fetch(`/api/admin/change_sp_verified_status/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({
                    sp_verified_status: this.sp_verified_status
                })
            })
            .then(response => response.json())
            .then(data => this.$router.push('/admin_dashboard'))
        },
        changeFlag(id){
            fetch(`/api/flag_user/${id}`, {
                method: "PUT",
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