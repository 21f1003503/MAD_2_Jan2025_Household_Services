export default {
    template: `
        <div class="row ">
            <div class="col bg-light" style="height: 726px;">
                <div class=" bg-light text-center mx-auto mt-5" style="height: 230px; width: 500px;">
                    <h1 class="text-center">Registration</h1>
                    
                    <div class="d-grid gap-2 mt-5">
                        <router-link class="btn btn-primary btn-lg" to="/cu_registration" type="button">As a Customer</router-link>
                        <br>
                        <router-link class="btn btn-primary btn-lg " to="/sp_registration" type="button">As a Service Professional</router-link>
                    </div>
                </div>
            </div>
        </div>
    `
}