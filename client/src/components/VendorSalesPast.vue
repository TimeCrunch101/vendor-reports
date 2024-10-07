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

onMounted(() => {
    getVendorSales()
})

</script>
<template>

<!-- <button @click="saveSales()" class="btn btn-primary mt-3 mb-3">Save</button>
<div class="d-flex">
    <select class="form-select mb-3" aria-label="Default select example" v-model="selectedYear" style="width: max-content;">
        <option v-for="(num, index) in 10" :id="index" :value="(currentYear+1)-num">{{ (currentYear+1)-num }}</option>
    </select>
    <select class="form-select mb-3" aria-label="Default select example" v-model="selectedMonth" style="width: max-content;">
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
    </select>
</div> -->

<div class="table-responsive mt-5">
    <table class="table table-hover table-bordered table-striped table-sm w-50">
    <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Sold</th>
          <th scope="col">Range</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in pastSales">
          <th scope="row">{{ item.item_name }}</th>
          <th>{{ item.qty_sold }}</th>
          <th>{{ item.start_date.split("T")[0] }} - {{ item.end_date.split("T")[0] }}</th>
          <!-- <td><input type="number" min="0" :name="`qty_sold-${index}`" :id="`qty-sold-${index}`" v-model="sales[index].qty_sold"></td> -->
        </tr>
    </tbody>
    </table>
</div>




</template>



<style scoped>



</style>