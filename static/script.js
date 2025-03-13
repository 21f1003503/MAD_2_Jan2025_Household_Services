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
    {path: '/customer/close_s_req/:s_reqID',   name: 'close_sr',          component: Customer_Close_SR}
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: "#app",
    router,
    template: `
    <div class = "container">
        <nav-bar></nav-bar>
        <router-view></router-view>
        <foot></foot>
    </div>
    `,
    data: {
        section: "Frontend",
    },
    components: {
        "nav-bar": Navbar,
        "foot": Footer
    }
})