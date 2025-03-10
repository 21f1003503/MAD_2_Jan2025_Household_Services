export default {
    template: `
        <div class="row border">
            <div class="col" style="height: 750px;">
                <div class="border mx-auto mt-5" style="height: 400px; width: 300px;">
                    <h1>Registration</h1>
                    <router-link class="btn btn-primary my-2" to="/cu_registration">As a Customer</router-link>
                    <br><br>
                    <router-link class="btn btn-primary my-2" to="/sp_registration">As a Service Professional</router-link>
                </div>
            </div>
        </div>
    `
}