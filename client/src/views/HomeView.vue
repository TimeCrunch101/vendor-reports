<script setup>
import ChartComponent from "../components/ChartComponent.vue"
import axios from "axios"
import { ref, reactive, onMounted } from 'vue';

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
  axios.get("/api/v1/get/chart-data").then((res) => {
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
  width: 500px;
  height: 300px;
}

.backgroundColor {
  color: rgba(0, 255, 255, 1);
}
.borderColor {
  color: rgba(255, 0, 0, 1);
}
.color {
  color: #ffffff;
}


</style>
