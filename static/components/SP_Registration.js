export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px;">
                <div class="border mx-auto mt-5 text-center" style="height: 625px; width: 500px; overflow-y: scroll;">
                    <div>
                        <h2 class="text-center">Service Professional Registration Page</h2>
                        
                        <div>
                            <label for="username">Enter Your Email:</label><br>
                            <input type="text" id="username" v-model="formData.username" required>
                        </div>
                        <br>
                        <div>
                            <label for="pass">Enter Your Password:</label><br>
                            <input type="password" id="pass" v-model="formData.password" required>
                        </div>
                        <br>
                        <div>
                            <label for="full_name">Enter Your Full Name:</label><br>
                            <input type="text" id="full_name" v-model="formData.full_name" required>
                        </div>
                        <br>
                        <div>
                            <label for="serviceID" class="form-label">Select Your Service:</label>
                            <div class="d-flex justify-content-center align-items-center">
                            <select class="form-select w-50 text-center mx-2" aria-label="Select A Service:" v-model="formData.serviceID" id="serviceID" type=number>
                                <option v-for="service in allServices" :key="service.serviceID" :value="service.serviceID">
                                            #{{ service.serviceID }} {{ service.service_name }}
                                </option>
                            </select>
                            </div>
                        </div>
                        <br>
                        <div>
                            <label for="sp_experience">Enter Your Years of Experience:</label><br>
                            <input type="number" id="sp_experience" v-model="formData.sp_experience" required>
                        </div>
                        <br>
                        <div>
                            <label for="pincode">Enter Your Pincode:</label><br>
                            <input type="number" id="pincode" v-model="formData.pincode" required>
                        </div>
                        <br>
                        <div>
                            <label for="phone_number">Enter Your Phone Number:</label><br>
                            <input type="number" id="phone_number" v-model="formData.phone_number" required>
                        </div>
                        <br>
                        <div>
                            <button class="btn btn-success mt-2" @click="spRegister">REGISTER</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            formData: {
                 username: "",
                 password: "",
                 full_name: "",
                 sp_experience: "",
                 pincode: "",
                 phone_number: "",
                 serviceID: "",
                 sp_document: null
            },
            allServices: null
        }
    },
    mounted(){
        this.loadServices()
    },
    methods: {
    
        handleFileUpload(event) {
            this.formData.sp_document = event.target.files[0];
            console.log('File uploaded')
            console.log('sp_document:', this.formData.sp_document)
          },

        spRegister: function(){
            fetch('/api/sp_registration', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                this.$router.push('/login')
            })
        },
        loadServices(){
            fetch('/api/login_services/get', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.allServices = data
            })
        }
    }
}