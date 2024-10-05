<script setup>
import ChartComponent from "./charts/ChartComponent.vue";
import { useRoute } from "vue-router"
import axios from "axios";
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from "../stores/auth.js"


const route = useRoute()
const auth = useAuthStore()
const token = ref(auth.getToken)
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: '# of items',
      data: [],
      fill: true,
      tension: 0.1
    }
  ]
});
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false,
      text: ''
    }
  }
});

const set = reactive({
  chartData,
  chartOptions
})

const getData = () => {
  axios.get(`/api/v1/get/items-by-vendor/${route.params.id}`,{
    headers: {
        Authorization: `Bearer ${token.value}`
    }
  }).then((res) => {
    let chartLabels = []
    let chartValues = []
    res.data.itemList.forEach(item => {
        chartLabels.push(item.item_name)
        chartValues.push(item.qty)
    });
    set.chartData.labels = chartLabels
    set.chartData.datasets[0].data = chartValues
  }).catch((err) => {
      console.error(err)
  })
}

onMounted(() => {
  getData()
})

</script>

<template>
    <div class="chart-container">
      <ChartComponent
        :chartData="chartData"
        :chartOptions="chartOptions"
        chartType="bar"
      />
    </div>
  </template>

<style scoped>

</style>
