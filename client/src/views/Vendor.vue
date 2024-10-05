<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "../stores/auth.js"
import { onMounted, ref, reactive } from "vue";
import VendorItemList from "../components/VendorItemList.vue"
import VendorOverview from "../components/VendorOverview.vue"
import Restock from "../components/Restock.vue"
import axios from 'axios';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const token = ref(auth.getToken)
const vendor = ref({})
const set = reactive({
  vendor
})


const getVendorInfo = () => {
  axios.get(`/api/v1/get/vendor/${route.params.id}`,{
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  }).then((res) => {
    set.vendor = res.data.vendor
  }).catch((err) => {
    console.error(err.response.data)
  })
}


onMounted(() => {
  getVendorInfo()
})

</script>

<template>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><router-link to="/vendors">Vendors</router-link></li>
    <li class="breadcrumb-item active" aria-current="page">{{ vendor.name }}</li>
  </ol>
</nav>

<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview-tab-pane" type="button" role="tab" aria-controls="overview-tab-pane" aria-selected="true">Overview</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="item-list" data-bs-toggle="tab" data-bs-target="#item-list-pane" type="button" role="tab" aria-controls="item-list-pane" aria-selected="false">Inventory</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="restocks" data-bs-toggle="tab" data-bs-target="#restocks-pane" type="button" role="tab" aria-controls="restocks-pane" aria-selected="false">Restocks</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab" tabindex="0">
    <VendorOverview />
  </div>
  <div class="tab-pane fade" id="item-list-pane" role="tabpanel" aria-labelledby="item-list" tabindex="0">
    <VendorItemList />
  </div>
  <div class="tab-pane fade" id="restocks-pane" role="tabpanel" aria-labelledby="restocks" tabindex="0">
    <Restock/>
  </div>
</div>
</template>

<style scoped>

</style>
