<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from "vue";
import axios from 'axios';

const route = useRoute()
const router = useRouter()



onMounted(() => {

})

</script>

<template>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><router-link to="/vendors">Vendors</router-link></li>
    <li class="breadcrumb-item active"><a href="#">Library</a></li>
    <li class="breadcrumb-item active" aria-current="page">Data</li>
  </ol>
</nav>





</template>

<style scoped>

</style>
