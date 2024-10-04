<script setup>
import ChartComponent from "../components/ChartComponent.vue"
import axios from "axios"
import { ref, reactive, onMounted } from 'vue';


const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Items By Vendor',
            data: [1,2,3,4,5],
            fill: true,
            backgroundColor: 'rgba(0, 0, 0, .5)', // Light blue fill for bars
            borderColor: 'rgba(140, 0, 0, 1)', // Blue border for bars
            borderColor: 'rgb(140, 0, 0)',
            tension: 0.1
        }
    ]
});

const set = reactive({
  chartData
})

onMounted(() => {
    axios.get("/api/v1/get/chart-data").then((res) => {
        const data = res.data.chartData
        data.forEach(element => {
            set.chartData.labels.push(element.vendor)        
        });
        data.forEach(element => {
                console.log(set.chartData.datasets[0].data.push(element.vendor))
        });
        console.log(chartData.value)
    }).catch((err) => {
        console.error(err)
    })
})


const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false,
    //   text: 'Chart.js Line Chart'
    }
  }
});

</script>

<template>
  <div>
    <ChartComponent
      :chartData="chartData"
      :chartOptions="chartOptions"
      chartType="bar"
    />
  </div>
</template>
