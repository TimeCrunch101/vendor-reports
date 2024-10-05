<script setup>
import { onMounted, ref, watch } from 'vue';
import { Chart } from 'chart.js/auto';

// Props
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  },
  chartType: {
    type: String,
    default: 'line'
  }
});

// Local references
const chartCanvas = ref(null);
let chartInstance = null;

// Function to create the chart
const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy(); // Destroy existing chart before creating a new one
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: props.chartType,
    data: props.chartData,
    options: props.chartOptions
  });
};

// Lifecycle hook to mount the chart
onMounted(() => {
  createChart();
});

// Watch for changes in chartData to update the chart
watch(
  () => props.chartData,
  (newData) => {
    if (chartInstance) {
      chartInstance.data = newData;
      chartInstance.update();
    }
  },{deep: true}
);
</script>

<template>
<canvas ref="chartCanvas"></canvas>
</template>

<style scoped>

</style>

