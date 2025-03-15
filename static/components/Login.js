export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px;">
                <div class="border mx-auto mt-5" style="height: 400px; width: 300px;">
                    <div>
                        <h2 class="text-center">Login Page</h2>
                        
                        <div class="mx-2 mb-3">
                            <label for="username" class="form-label">Email address:</label>
                            <input type="email" class="form-control" id="username" v-model="formData.username" placeholder="name@gmail.com">
                        </div>
                        <div class="mx-2 mb-3">
                            <label for="password" class="form-label">Password:</label>
                            <input type="password" class="form-control" id="password" v-model="formData.password">
                        </div>
                        <div class="mx-2 mb-3 text-center">
                            <button class="btn btn-primary mt-2" @click="userLogin">Login</button>
                        </div>
                        <p class="mx-2 mt-2 text-danger text-center">{{ message }}</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return {
            formData: {
                 username: "",
                 password: ""
            },
            message: ""
        }
    },
    methods: {
        userLogin: function(){
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => {
                if(Object.keys(data).includes("auth-token")){
                    localStorage.setItem("auth_token", data["auth-token"])
                    localStorage.setItem("id", data.id)
                    localStorage.setItem("full_name", data.full_name)
                    console.log(data.roles)
                    console.log(data)
                    if(data.roles.includes('admin')){
                        this.$router.push('/admin_dashboard')
                        setTimeout(() => {
                            window.location.reload(); 
                        }, 100);
                    }
                    else if(data.roles.includes('customer')){
                        this.$router.push('/cu_dashboard')
                        setTimeout(() => {
                            window.location.reload(); 
                        }, 100);
                    }
                    else{
                        this.$router.push('/sp_dashboard')
                        setTimeout(() => {
                            window.location.reload(); 
                        }, 100);
                    }
                }
                else{
                    this.message = data.message
                }
            })
           
        }
    }
}