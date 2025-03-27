import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Registration from './components/Registration.js'
import Cu_Registration from './components/Cu_Registration.js'
import SP_Registration from './components/SP_Registration.js'
import AdminDashboard from './components/AdminDashboard.js'
import Cu_Dashboard from './components/Cu_Dashboard.js'
import AdminServices from './components/AdminServices.js'
import SPVerification from './components/SPVerification.js'
import AdminCustomers from './components/AdminCustomers.js'
import AdminSP from './components/AdminSP.js'
import AdminSPAction from './components/AdminSPAction.js'
import SP_Dashboard from './components/SP_Dashboard.js'
import Customer_Close_SR from './components/Customer_Close_SR.js'
import UpdateService from './components/UpdateService.js'
import Edit_SR from './components/Edit_SR.js'
import SearchResults from './components/SearchResults.js'
import RegisterComplaint from './components/RegisterComplaint.js'
import AdminComplaints from './components/AdminComplaints.js'
import AdminServReqs from './components/AdminServReqs.js'
import Create_SR from './components/Create_SR.js'
import Cu_Profile from './components/Cu_Profile.js'
import AdminSRS from './components/AdminSRS.js'

const routes = [
    {path: '/',                                                           component: Home},
    {path: '/login',                                                      component: Login},
    {path: '/register',                                                   component: Register},
    {path: '/cu_dashboard',                                               component: Cu_Dashboard},
    {path: '/registration',                                               component: Registration},
    {path: '/cu_registration',                                            component: Cu_Registration},
    {path: '/sp_registration',                                            component: SP_Registration},
    {path: '/admin_dashboard',                                            component: AdminDashboard},
    {path: '/admin/services',                                             component: AdminServices},
    {path: '/admin/sp_verification/:id',                                  component: SPVerification},
    {path: '/admin/customers',                                            component: AdminCustomers},
    {path: '/admin/service_professionals',                                component: AdminSP},
    {path: '/admin/sp_action/:id',             name: 'sp_action',         component: AdminSPAction},
    {path: '/sp_dashboard',                                               component: SP_Dashboard},
    {path: '/customer/close_s_req/:s_reqID',   name: 'close_sr',          component: Customer_Close_SR},
    {path: '/admin/update_service/:serviceID', name: 'update_service',    component: UpdateService},
    {path: '/customer/edit_sr/:s_reqID',       name: 'edit_sr',           component: Edit_SR},
    {path: '/search_results',                                             component: SearchResults},
    {path: '/register_complaint/:s_reqID',     name: 'reg_complaint',     component: RegisterComplaint},
    {path: '/admin/complaints',                                           component: AdminComplaints},
    {path: '/admin/service_requests',                                     component: AdminServReqs},
    {path: '/create_serv_req',                 name: 'create_sr',         component: Create_SR},
    {path: '/cu_profile',                                                 component: Cu_Profile},
    {path: '/admin/service_request_status',                               component: AdminSRS}
]
const router = new VueRouter({
    routes
})

const app = new Vue({
    el: "#app",
    router,
    template: `
    <div class = "container-fluid">
        <div class="col-12">
            <nav-bar></nav-bar>
        </div>
        <div class="container my-4">
            <router-view></router-view>
        </div>
        <div class="col-12">
            <foot></foot>
        </div>
    </div>
    `,
    data: {
        logInStatus: false,
    },
    components: {
        "nav-bar": Navbar,
        "foot": Footer
    },
    
})