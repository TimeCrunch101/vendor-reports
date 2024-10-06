<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "../stores/auth.js"
import { onMounted, ref, reactive, computed } from "vue";
import axios from 'axios';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const token = ref(auth.getToken)
const restockForms = ref(null)
const loading = ref(true)
const selectedMonth = ref('');
const set = reactive({
  restockForms,
  loading
})

const filteredRestockForms = computed(() => {
    if (selectedMonth.value === '') return restockForms.value;
    return restockForms.value.filter(form => {
        const formMonth = new Date(form.date).getMonth();
        return formMonth == selectedMonth.value;
  });
});

const getAllRestocks = () => {
  axios.get("/api/v1/get/restock-forms",{
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  }).then((res) => {
    set.restockForms = res.data.restockForms
    set.loading = false
  }).catch((err) => {
    console.error(err.response.data)
  })
}

const deleteRestockForm = (id) => {
    axios.post(`/api/v1/delete/restock-order/${id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        getAllRestocks()
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(() => {
    getAllRestocks()
})

</script>

<template>
    <h1>Restocks</h1>
  
    <select class="form-select" aria-label="Default select example" v-model="selectedMonth" style="width: max-content;">
      <option value="">All Year</option>
      <option value="0">January</option>
      <option value="1">February</option>
      <option value="2">March</option>
      <option value="3">April</option>
      <option value="4">May</option>
      <option value="5">June</option>
      <option value="6">July</option>
      <option value="7">August</option>
      <option value="8">September</option>
      <option value="9">October</option>
      <option value="10">November</option>
      <option value="11">December</option>
    </select>
  
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Item Name</th>
            <th scope="col">Vendor</th>
            <th scope="col">Restock QTY</th>
            <th scope="col">Restock Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody v-if="loading === false">
          <tr v-for="form in filteredRestockForms" :key="form.id">
            <td>{{ form.item_name }}</td>
            <td><router-link :to="`/vendor/${form.vendor_id}`">{{ form.vendor_name }}</router-link></td>
            <td>{{ form.restock_qty }}</td>
            <td>{{ form.date.split("T")[0] }}</td>
            <td><i @click="deleteRestockForm(form.id)" class="bi bi-trash3-fill"></i></td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="num in 5" :key="num">
            <td>
              <p class="placeholder-glow">
                <span class="placeholder col-12"></span>
              </p>
            </td>
            <td>
              <p class="placeholder-glow">
                <span class="placeholder col-12"></span>
              </p>
            </td>
            <td>
              <p class="placeholder-glow">
                <span class="placeholder col-12"></span>
              </p>
            </td>
            <td>
              <p class="placeholder-glow">
                <span class="placeholder col-12"></span>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

<style scoped>

</style>