export default {
    template: `
        <div class="row">
            <div class="col bg-light" style="height: 727px;">
                <div class=" mx-auto mt-5 text-center" style="height: 650px; width: 500px;">
                    <div>
                        <h2 class="text-center">Customer Profile</h2>
                        <div class="mt-5">
                            <h6>Username</h6>
                            <strong>{{ formData.username }}</strong>
                        </div>
                        <div class="mt-4">
                            <h6>Full Name</h6>
                            <strong>{{ formData.full_name }}</strong>
                        </div>
                        <div class="mt-4">
                            <h6>Address</h6>
                            <strong>{{ formData.cu_address }}</strong>
                        </div>
                        <div class="mt-4">
                            <h6>Pincode</h6>
                            <strong>{{ formData.pincode }}</strong>
                        </div>
                        <div class="mt-4">
                            <h6>Phone Number</h6>
                            <strong>{{ formData.phone_number }}</strong>
                        </div>
                        <div class="mt-4">
                            <h6>Flag</h6>
                            <strong>{{ formData.flag }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    mounted() {
        this.loadUser()
    },
    data: function(){
        return {
            formData: ""
        }
    },
    methods: {
        loadUser(){
            fetch('/api/cu_home', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.formData = data)
        },
    }
}