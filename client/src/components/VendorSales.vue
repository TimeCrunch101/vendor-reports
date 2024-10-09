<script setup>
import axios from 'axios';
import { useRoute } from "vue-router";
import { useAuthStore } from '../stores/auth.js';
import {ref,reactive, onMounted, computed} from "vue";

const props = defineProps({
    vendorName: String
})
const auth = useAuthStore()
const route = useRoute()
const currentDate = ref(new Date())
const token = ref(auth.getToken)
const sales = ref([])
const selectedMonth = ref(currentDate.value.getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedYear = ref(new Date().getFullYear())
const set = reactive({
    sales,
    selectedMonth,
    selectedYear
})

const getFirstAndLastDayOfMonth = () => { // TODO: watch this...
    const now = new Date(`${selectedYear.value}-${selectedMonth.value}-01T12:00:00`);
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (date) => date.toISOString().split('T')[0];
    return {
        firstDay: formatDate(firstDay),
        lastDay: formatDate(lastDay)
    };
};


const getSales = () => {
    axios.get(`/api/v1/get/sales-by-vendor/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        const salesFromDB = res.data.vendorSales
        salesFromDB.forEach((element, index) => {
            if (element.qty_sold === null) {
                salesFromDB[index].qty_sold = 0
            }
        });
        set.sales = salesFromDB
    }).catch((err) => {
        console.error(err.response.data)
    })
}

const saveSales = () => {
    let showAlert = false
    sales.value.forEach(sale => {
        if (sale.qty_sold === null) {
            showAlert = true
        }
    });
    if (showAlert) {
        alert("Please fill in a value for sales")
    } else {
        const dateRange = getFirstAndLastDayOfMonth()
        axios.post(`/api/v1/add/sales-to-vendor/${route.params.id}`, {
            sales: sales.value,
            dateRange: dateRange
        },{
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        }).then((res) => {
            zeroize()
            alert("Sales Report Saved")
        }).catch((err) => {
            console.error(err)
        })
    }
}

const normalizeMonth = () => {
    // TODO: watch this...
    const indexedMonth = currentDate.value.getMonth()
    switch (indexedMonth.toString().length) {
        case 1:
            if (indexedMonth !== 9) {
                set.selectedMonth = `0${indexedMonth+1}`
            } else {
                set.selectedMonth = `${indexedMonth+1}`
            }
            break;
        case 2:
            set.selectedMonth = `${indexedMonth+1}`
        default:
            break;
    }
}

const zeroize = () => {
    normalizeMonth()
    set.selectedYear = currentYear.value
    sales.value.forEach(sale => {
        sale.qty_sold = 0        
    });
}

onMounted(() => {
    getSales()
    normalizeMonth()
})

</script>
<template>
    <div class="d-flex mt-3 mb-3">
        <button style="margin-right: 1em;" @click="saveSales()" class="btn btn-primary">Save Sales Report</button>
        <select class="form-select" aria-label="Default select example" v-model="selectedYear" style="width: max-content;">
            <option v-for="(num, index) in 10" :id="index" :value="(currentYear+1)-num">{{ (currentYear+1)-num }}</option>
        </select>
        <select class="form-select" aria-label="Default select example" v-model="selectedMonth" style="width: max-content;">
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
        
    </div>
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
            <th>${{ item.price }}</th>
            <th>{{ item.qty }}</th>
            <td><input class="form-control form-control-sm" type="number" min="0" :name="`qty_sold-${index}`" :id="`qty-sold-${index}`" v-model="sales[index].qty_sold"></td>
            </tr>
        </tbody>
        </table>
    </div>
</template>
<style scoped>
.table-responsive {
    max-width: 70%;
}
</style>