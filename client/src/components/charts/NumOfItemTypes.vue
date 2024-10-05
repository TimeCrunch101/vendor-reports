<script setup>
import ChartComponent from "./ChartComponent.vue";
import axios from "axios";
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from "../../stores/auth.js"

const auth = useAuthStore()
const token = ref(auth.getToken)
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: '# of item types',
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
      display: true,
      text: 'Items by Vendor'
    }
  }
});

const set = reactive({
  chartData
})

const getData = () => {
  axios.get("/api/v1/get/chart-data/item-types",{
    headers: {
        Authorization: `Bearer ${token.value}`
    }
  }).then((res) => {
      const data = res.data.chartData
      let labels = []
      let dataFromAPI = []
      for (let i = 0; i < data.length; i++) {
        const ele = data[i];
        labels.push(ele.vendor)
        dataFromAPI.push(ele.items)
      }
      set.chartData.labels = labels
      set.chartData.datasets[0].data = dataFromAPI
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
  border: 1px solid rgba(255, 255, 255, 0.3); /* subtle border */
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
