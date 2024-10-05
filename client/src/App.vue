<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';

</script>

<template>
  <NavBar />
  <div class="container mt-5">
    <RouterView />
  </div>
</template>

<style>
.chart-container {
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  /* background: rgba(255, 255, 255, 0.2); */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25),
              inset 0 1px 1px rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin: 1em;
  width: 600px;
  height: 400px;
}
</style>
