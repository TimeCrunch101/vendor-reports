<script setup>
import axios from "axios"
import { useRoute } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { ref, onMounted, reactive, computed } from "vue"

const props = defineProps({
    vendorName: String,
    vendorID: String
})
const generateDateOptions = () => {
    const options = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        options.push(date.toISOString().slice(0, 7)); // Format as YYYY-MM
    }
    return options;
}
const auth = useAuthStore()
const route = useRoute()
const token = ref(auth.getToken)
const tableData = ref(null)
const currentMonth = ref(null)
const dateOptions = ref(generateDateOptions()); // Populate with date options
const selectedDate = ref('');
const set = reactive({
    tableData,
    currentMonth
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
    axios.post("/api/v1/get/vendor/eom-report", {
        vendor_id: props.vendorID,
        currentMonth: currentMonth.value
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

const calcTotalOH = computed(() => {
    let TotalOHValue = 0
    if (tableData.value) {
        tableData.value.forEach(element => {
            TotalOHValue = TotalOHValue += element.qty
        });
        return TotalOHValue
    } else {
        return 0
    }
    TotalOHValue = 0
})

const calcTotalRestock = computed(() => {
    let TotalRestockValue = 0
    if (tableData.value) {
        tableData.value.forEach(element => {
            if (element.restock_qty !== null) {
                TotalRestockValue = TotalRestockValue += element.restock_qty
            }
        });
        return TotalRestockValue
    } else {
        return 0
    }
    TotalRestockValue = 0
})

const calcTotalSold = computed(() => {
    let totalSoldValue = 0
    if (tableData.value) {
        tableData.value.forEach(element => {
            totalSoldValue = totalSoldValue += element.qty_sold
        });
        return totalSoldValue
    } else {
        return 0
    }
    totalSoldValue = 0
})

const calcTotalGross = computed(() => {
    let totalGrossValue = 0
    if (tableData.value) {
        tableData.value.forEach(element => {
            if (element.qty_sold > 0) {
                const gross = parseFloat(element.price) * parseFloat(element.qty_sold)
                totalGrossValue = totalGrossValue += gross
            }
        });
        return formatToUSD(totalGrossValue)
    } else {
        return 0
    }
    totalGrossValue = 0
})

const calcTotalCon = computed(() => {
    let totalConValue = 0
    if (tableData.value) {
        tableData.value.forEach(element => {
            if (element.qty_sold > 0) {
                const gross = parseFloat(element.price) * parseFloat(element.qty_sold)
                const consignment = gross * parseFloat(element.consignment)
                totalConValue = totalConValue += consignment
            }
        });
        return formatToUSD(totalConValue)
    } else {
        return 0
    }
    totalConValue = 0
})

const calcTotalNet = computed(() => {
    let totalNetValue = 0
    if (tableData.value) {
        tableData.value.forEach(element => {
            if (element.qty_sold > 0) {
                const gross = parseFloat(element.price) * parseFloat(element.qty_sold)
                const consignment = gross * parseFloat(element.consignment)
                const net = gross - consignment
                totalNetValue = totalNetValue += net
            }
        });
        return formatToUSD(totalNetValue)
    } else {
        return 0
    }
    totalNetValue = 0
})

const onDateChange = () => {
    set.currentMonth = selectedDate.value
    getData();
}

onMounted(() => {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    set.currentMonth = `${firstDay.split("-")[0]}-${firstDay.split("-")[1]}`
    getData()
})

</script>

<template>

<button v-if="route.fullPath !== '/eom/reports'" @click="getData()" class="btn btn-success mt-3"><i class="bi bi-arrow-clockwise"></i></button>

<div class="mb-3 d-flex">
    <select id="date-select" v-model="selectedDate" @change="onDateChange" class="form-select w-auto" placeholder="Select Date">
        <option v-for="date in dateOptions" :key="date" :value="date">
            {{ date }}
        </option>
    </select>
</div>

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
          <td>{{ formatToUSD(item.price) }}</td>
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
    <tfoot>
        <tr>
            <td colspan="3" class="text-end"><strong>TOTALS:</strong></td>
            <td><strong>{{ calcTotalOH }}</strong></td>
            <td><strong>{{ calcTotalRestock }}</strong></td>
            <td><strong>{{ calcTotalSold }}</strong></td>
            <td><strong>{{ calcTotalGross }}</strong></td>
            <td><strong>{{ calcTotalCon }}</strong></td>
            <td><strong>{{ calcTotalNet }}</strong></td>
        </tr>    
    </tfoot>
    </table>
</div>
</template>

<style scoped>

</style>