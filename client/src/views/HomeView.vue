<script setup>
import NumOfItemTypes from "../components/charts/NumOfItemTypes.vue"
import NumOfItems from "../components/charts/NumOfItems.vue"
import axios from "axios";
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from "../stores/auth.js"

const auth = useAuthStore()
const token = ref(auth.getToken)
const index = ref(null)
const set = reactive({
  index
})



const getData = () => {
  axios.get("/api/v1/get/vendors",{
    headers: {
        Authorization: `Bearer ${token.value}`
    }
  }).then((res) => {
    set.index = res.data.vendors.length
  }).catch((err) => {
      console.error(err)
  })
}



onMounted(() => {
  getData()
})
</script>

<template>

<div id="charts-container">
  <NumOfItemTypes/>
  <NumOfItems v-for="i in index" :index="i"/>
</div>

</template>

<style scoped>
#charts-container{
  max-width: 1296px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
