<script setup>
import axios from "axios"
import { useRoute } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { ref, onMounted, reactive } from "vue"
import VendorEOMReport from "../components/VendorEOMReport.vue"

const auth = useAuthStore()
const token = ref(auth.getToken)
const vendors = ref([])
const set = reactive({
    vendors
})

const getVendors = () => {
    axios.get("/api/v1/get/vendors",{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
      }).then((res) => {
      set.vendors = res.data.vendors
    }).catch((err) => {
        console.error(err.response.data)
    })
}

onMounted(() => {
    getVendors()
})
</script>

<template>

<div v-for="vendor in vendors" :key="vendor.id" class="mb-5">
  <VendorEOMReport :vendorName="vendor.name" :vendorID="vendor.id"/>
  <!-- <hr> -->
</div>

</template>

<style scoped>

</style>
