<script setup>
import axios from 'axios';
import { useRoute } from "vue-router";
import { useAuthStore } from '../stores/auth.js';
import {ref,reactive, onMounted} from "vue";

const props = defineProps({
    vendorName: String
})
const auth = useAuthStore()
const route = useRoute()
const token = ref(auth.getToken)
const sales = ref([])
const set = reactive({
    sales
})


const getSales = () => {
    axios.get(`/api/v1/get/sales-by-vendor/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.sales = res.data.vendorSales
    }).catch((err) => {
        console.error(err.response.data)
    })
}

onMounted(() => {
    getSales()
})

</script>
<template>


<div class="table-responsive">
    <table class="table table-hover table-bordered table-striped table-sm">
        <caption>EOM Sales - {{ props.vendorName }}</caption>
    <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Price</th>
          <th scope="col">Qty OH</th>
          <th scope="col">Sold</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in sales" :key="item.id">
          <th scope="row">{{ item.item_name }}</th>
          <th>{{ item.price }}</th>
          <th>{{ item.qty }}</th>
          <td><input type="number" name="qty_sold" id="qty_sold" v-model="sales[index].qty_sold"></td>
        </tr>
    </tbody>
    </table>
</div>




</template>



<style scoped>



</style>