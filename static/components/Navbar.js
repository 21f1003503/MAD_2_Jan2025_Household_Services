export default {
    template: `
        <div class="row border">
            <div class="col-9 border fs-2">
                FixItNow
            </div>
            <div class="col-3 border">
                <router-link class="btn btn-primary my-2" to="/login">Login</router-link>
                <router-link class="btn btn-warning my-2" to="/registration">Register</router-link>
                <router-link class="btn btn-outline-danger my-2" to="/">Logout</router-link>
            </div>
        </div>
    `
}