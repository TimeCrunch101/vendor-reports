<script setup>
import axios from "axios"
import { useRoute } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { ref, onMounted, reactive, computed } from "vue"

const props = defineProps({
    vendorName: String,
    vendorID: String
})
const auth = useAuthStore()
const route = useRoute()
const token = ref(auth.getToken)
const tableData = ref(null)
const set = reactive({
    tableData
})

const formatToUSD = (amount) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(amount);
}

const getFirstAndLastDayOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDate = (date) => date.toISOString().split('T')[0];
  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay)
  };
};

const getData = () => {
    // const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    // const currentMonth = `${firstDay.split("-")[0]}-${firstDay.split("-")[1]}`
    axios.post("/api/v1/get/vendor/eom-report", {
        vendor_id: props.vendorID,
        // currentMonth: currentMonth
    }, {
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.tableData = res.data.restockReport
        console.log(tableData.value)
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(() => {
    getData()
})

</script>

<template>

<button v-if="route.fullPath !== '/eom/reports'" @click="getData()" class="btn btn-success mt-3"><i class="bi bi-arrow-clockwise"></i></button>

<div v-if="tableData?.length !== 0" class="table-responsive">
    <table class="table table-hover table-bordered table-striped table-sm">
        <caption>EOM Report - {{ props.vendorName }}</caption>
    <thead>
        <tr>
          <th scope="col">Vendor</th>
          <th scope="col">Item</th>
          <th scope="col">Price</th>
          <th scope="col">Qty OH</th>
          <th scope="col">Restock Qty</th>
          <th scope="col">Sold</th>
          <th scope="col">Gross Sales</th>
          <th scope="col">Consignment</th>
          <th scope="col">Net Sales</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in tableData" :key="item.item_id" :class="{'table-danger' : (item.qty + item.restock_qty) < item.qty_sold}">
          <td v-if="index === 0" scope="row"><router-link :to="`/vendor/${props.vendorID}`">{{ props.vendorName }}</router-link></td>
          <td v-else></td>
          <td>{{ item.item_name }}</td>
          <td>${{ item.price }}</td>
          <td>{{ item.qty }}</td>
          <td v-if="item.restock_qty !== null">{{ item.restock_qty}}</td>
          <td v-else>0</td>
          <td v-if="item.qty_sold !== null">{{ item.qty_sold }}</td>
          <td v-else>0</td>
          <td>{{ formatToUSD(item.price * item.qty_sold) }}</td>
          <td>{{ formatToUSD((item.price * item.qty_sold) * item.consignment) }}</td>
          <td>{{ formatToUSD(((item.price * item.qty_sold) - ((item.price * item.qty_sold) * item.consignment))) }}</td>
        </tr>
    </tbody>
    </table>
</div>
</template>

<style scoped>

</style>