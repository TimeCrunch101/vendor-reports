<script setup>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import {ref,reactive, onMounted} from "vue";
import Modal from '../components/modals/AddVendorModal.vue';

const auth = useAuthStore()
const token = ref(auth.getToken)
const vendors = ref([])
const set = reactive({
    vendors
})

const getVendors = () => {
    axios.get("/api/v1/get/vendors",{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.vendors = res.data.vendors
    }).catch((err) => {
        console.error(err.response.data)
    })
}

const deleteVendor = (id) => {
    if (confirm("Are you sure you want to delete this vendor? This action can not be reversed!")) {
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
                    <!-- <th scope="col">POC</th> -->
                    <th scope="col">Consignment</th>
                    <th scope="col">Code</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="vendor in vendors">
                    <td><router-link :to="`/vendor/${vendor.id}`">{{ vendor.name }}</router-link></td>
                    <td v-if="vendor.poc !== null">{{ vendor.poc }}</td>
                    <!-- <td v-else>No POC</td> -->
                    <td>{{ vendor.consignment }}</td>
                    <td>{{ vendor.bm_ven_code }}</td>
                    <td><i @click="deleteVendor(vendor.id)" class="bi bi-trash3-fill"></i></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>

</style>
