<script setup>
import axios from 'axios';
import { useRoute } from "vue-router";
import { useAuthStore } from '../stores/auth.js';
import { ref, reactive, onMounted } from "vue";

const props = defineProps({
    vendorName: String
})
const auth = useAuthStore()
const route = useRoute()
const token = ref(auth.getToken)
const pastSales = ref([])
const set = reactive({
    pastSales
})

const getVendorSales = () => {
    axios.get(`/api/v1/get/sales/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.pastSales = res.data.vendorSalesAll
    }).catch((err) => {
        console.error(err.response.data)
    })
}

const deleteSale = (id) => {
    axios.post(`/api/v1/delete/sale/${id}`,{},{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        getVendorSales()
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(() => {
    getVendorSales()
})

</script>
<template>

<button @click="getVendorSales()" class="btn btn-success mt-3"><i class="bi bi-arrow-clockwise"></i></button>

<div class="table-responsive mt-5">
    <table class="table table-hover table-bordered table-striped table-sm w-50">
    <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Sold</th>
          <th scope="col">Range</th>
          <th scope="col"></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in pastSales">
          <td scope="row">{{ item.item_name }}</td>
          <td>{{ item.qty_sold }}</td>
          <td>{{ item.start_date.split("T")[0] }} - {{ item.end_date.split("T")[0] }}</td>
          <td><i @click="deleteSale(item.sale_id)" class="bi bi-trash3-fill"></i></td>
        </tr>
    </tbody>
    </table>
</div>
</template>



<style scoped>



</style>