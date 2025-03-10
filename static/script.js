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

const routes = [
    {path: '/',                 component: Home},
    {path: '/login',            component: Login},
    {path: '/register',         component: Register},
    {path: '/cu_dashboard',     component: Cu_Dashboard},
    {path: '/registration',     component: Registration},
    {path: '/cu_registration',  component: Cu_Registration},
    {path: '/sp_registration',  component: SP_Registration},
    {path: '/admin_dashboard',  component: AdminDashboard}
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