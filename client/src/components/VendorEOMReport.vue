<script setup>














const getFirstAndLastDayOfMonth = () => {
  const now = new Date();

  // Get the first day of the current month
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get the last day of the current month
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Format to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];

  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay)
  };
};

const { firstDay, lastDay } = getFirstAndLastDayOfMonth();

console.log("First day of the month:", firstDay); // e.g., "2024-10-01"
console.log("Last day of the month:", lastDay);   // e.g., "2024-10-31"





















































</script>

<template>

</template>

<style scoped>

</style>