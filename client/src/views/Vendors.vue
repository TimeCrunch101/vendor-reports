<script setup>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import {ref,reactive, onMounted} from "vue";
import Modal from '../components/modals/AddVendorModal.vue';

const auth = useAuthStore()
const token = ref(auth.getToken)
const vendors = ref([])
const loading = ref(true)
const set = reactive({
    vendors,
    loading
})

const getVendors = () => {
    axios.get("/api/v1/get/vendors",{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.vendors = res.data.vendors
        set.loading = false
    }).catch((err) => {
        console.error(err.response.data)
    })
}

const deleteVendor = (id) => {
    axios.post(`/api/v1/delete/vendor/${id}`,{},{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        alert("Vendor Deleted")
        getVendors()
    }).catch((err) => {
        console.error(err.response.data)
    })
}

onMounted(() => {
    getVendors()
})
</script>

<template>
    <Modal @update="getVendors()"/>
    <div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">POC</th>
                    <th scope="col">Consignment</th>
                    <th scope="col">Code</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody v-if="loading === false">
                <tr v-for="vendor in vendors">
                    <td><router-link :to="`/vendor/${vendor.id}`">{{ vendor.name }}</router-link></td>
                    <td v-if="vendor.poc !== null">{{ vendor.poc }}</td>
                    <td v-else>No POC</td>
                    <td>{{ vendor.consignment }}</td>
                    <td>{{ vendor.bm_ven_code }}</td>
                    <td><i @click="deleteVendor(vendor.id)" class="bi bi-trash3-fill"></i></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr v-for="num in 5">
                    <td>
                        <p class="placeholder-glow">
                            <span class="placeholder col-12"></span>
                        </p>
                    </td>
                    <td>
                        <p class="placeholder-glow">
                            <span class="placeholder col-12"></span>
                        </p>
                    </td>
                    <td>
                        <p class="placeholder-glow">
                            <span class="placeholder col-12"></span>
                        </p>
                    </td>
                    <td>
                        <p class="placeholder-glow">
                            <span class="placeholder col-12"></span>
                        </p>
                    </td>
                    
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.bi-trash3-fill {
    color: rgb(255, 72, 72)
}
.bi-trash3-fill:hover {
    cursor: pointer;
}
.placeholder-glow {
    margin-bottom: 0;
}
</style>
