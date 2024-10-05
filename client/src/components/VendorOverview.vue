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
    <div id="chart-container">
      <ChartComponent
        :chartData="chartData"
        :chartOptions="chartOptions"
        chartType="bar"
      />
    </div>
  </template>

<style scoped>

#chart-container {
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25),
              inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin: 1em;
  width: 600px;
  height: 400px;
}
</style>
