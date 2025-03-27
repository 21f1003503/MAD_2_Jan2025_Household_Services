export default {
    template: `
        <div class="row">
            <div class="col bg-light" style="height: 727px;">
                <div class=" mx-auto mt-5 text-center" style="height: 650px; width: 500px;">
                    <div>
                        <h2 class="text-center">Customer Registration Page</h2>
                        <div>
                            <label for="username">Enter Your Email:</label><br>
                            <input type="text" id="username" v-model="formData.username">
                        </div>
                        <br>
                        <div>
                            <label for="pass">Enter Your Password:</label><br>
                            <input type="password" id="pass" v-model="formData.password">
                        </div>
                        <br>
                        <div>
                            <label for="full_name">Enter Your Full Name:</label><br>
                            <input type="text" id="full_name" v-model="formData.full_name">
                        </div>
                        <br>
                        <div>
                            <label for="cu_address">Enter Your Address:</label><br>
                            <input type="text" id="cu_address" v-model="formData.cu_address">
                        </div>
                        <br>
                        <div>
                            <label for="pincode">Enter Your Pincode:</label><br>
                            <input type="number" id="pincode" v-model="formData.pincode">
                        </div>
                        <br>
                        <div>
                            <label for="phone_number">Enter Your Phone Number:</label><br>
                            <input type="number" id="phone_number" v-model="formData.phone_number">
                        </div>
                        <br>
                        <div>
                            <button class="btn btn-success mt-2" @click="customerRegister">REGISTER</button>
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
                 cu_address: "",
                 pincode: "",
                 phone_number: ""
            }
        }
    },
    methods: {
        customerRegister: function(){
            fetch('/api/cu_registration', {
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
        }
    }
}