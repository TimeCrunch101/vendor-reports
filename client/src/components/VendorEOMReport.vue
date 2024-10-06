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
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    const currentMonth = `${firstDay.split("-")[0]}-${firstDay.split("-")[1]}`
    axios.post("/api/v1/get/vendor/eom-report", {
        vendor_id: props.vendorID,
        currentMonth: currentMonth
    }, {
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.tableData = res.data.restockReport
    }).catch((err) => {
        console.error(err)
    })
}


const test = computed((i) => {
    
    return 0
})

onMounted(() => {
    getData()
})

</script>

<template>









<div class="table-responsive">
    <table class="table table-hover table-bordered table-striped table-sm">
        <!-- <caption>EOM Report - {{ props.vendorName }}</caption> -->
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
        <tr v-for="(item, index) in tableData" :key="item.item_id">
          <th v-if="index === 0" scope="row"> <router-link :to="`/vendor/${props.vendorID}`">{{ props.vendorName }}</router-link></th>
          <th v-else></th>
          <th>{{ item.item_name }}</th>
          <td>${{ item.price }}</td>
          <td>{{ item.qty }}</td>
          <td v-if="item.restock_qty !== null">{{ item.restock_qty}}</td>
          <td v-else>0</td>
          <td><input class="form-control form-control-sm w-auto" type="number" min="0" step="1" name="sold" :id="item.item_id" v-model="tableData[index].qty"></td>
          <td>{{ test }}</td>
          <td></td>
          <td></td>
          <!-- <td class="table-success"></td> -->
        </tr>
    </tbody>
    <!-- <tfoot>
        <tr>
          <th scope="row"></th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
    </tfoot> -->
    </table>
</div>











</template>

<style scoped>

</style>