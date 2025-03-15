export default {
    template: `
        <div class="row border">
            <div class="col border" style="height: 750px; overflow-y: scroll">
                <div v-for="service in allServices" v-if="service.serviceID" class="card mt-2">
                        <div class="card-header">
                            {{ service.category }}
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">#{{ service.serviceID }}: {{ service.service_name }}</h4>
                            <h6 class="card-text">About: {{ service.service_desc }}</h6>
                            <h6 class="card-text">Price: INR {{ service.service_price }}</h6>
                            <h6 class="card-text">Category: {{ service.category }}</h6>
                            <h6 class="card-text">Sub Category: {{ service.sub_category }}</h6>
                            <router-link class="btn btn-outline-primary btn-sm" :to="{name: 'update_service', params: {serviceID: service.serviceID}}">EDIT</router-link>
                            <button @click="deleteService(service.serviceID)" class = "btn btn-outline-danger btn-sm">DELETE</button>
                        </div>
                    </div>
            </div>
        </div>
    `,
    data() {
        return {
            searchRes: {
                "serviceID": "",
                "service_name": "",
                "category": "",
                "sub_category": "",
                "service_price": "",
                "service_desc": ""
            }
        }
    },
    methods: {
        loadSearchResults(){
            fetch('/search')
        }
    },
}