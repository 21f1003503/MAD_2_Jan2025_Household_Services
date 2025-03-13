export default {
    template: `
        <div class="row border">
            <div class="col-10 border fs-2">
                FixItNow
            </div>
            <div class="col-2 border">
                <div v-if="!loggedIn" class="mt-1 text-center">
                    <router-link class="btn btn-primary my-2" to="/login">Login</router-link>
                    <router-link class="btn btn-warning my-2" to="/registration">Register</router-link>
                    
                </div>
                <div v-else class="mt-1 text-center">
                    <button @click="log_out" class="btn btn-outline-danger my-2">Logout</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            loggedIn: localStorage.getItem("auth_token")
        }
    },
    watch: {
        loggedIn(new_value, old_value){
            this.$router.go(0)
        }
    },
    methods: {
        log_out(){
            localStorage.removeItem("auth_token");
            this.$router.push('/');
            setTimeout(() => {
                window.location.reload(); 
            }, 50); 
        }
    },
}