<script setup>
import axios from "axios";
import { useAuthStore } from "../stores/auth.js";
import { useRoute } from "vue-router";
import { ref, onMounted, reactive } from "vue";

const auth = useAuthStore()
const token = ref(auth.getToken)
const route = useRoute()
const restockForms = ref(null)
const loading = ref(true)
const set = reactive({
    restockForms,
    loading
})

const getRestockForms = () => {
    axios.get(`/api/v1/get/restock-forms/by-vendor/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.restockForms = res.data.restockForms
        set.loading = false
    }).catch((err) => {
        console.error(err)
    })
}

const deleteRestockOrder = (id) => {
    axios.post(`/api/v1/delete/restock-order/${id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        console.log(res)
        getRestockForms()
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(() => {
    getRestockForms()
})

</script>

<template>

<table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Restock Qty</th>
                    <th scope="col">Date</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody v-if="loading === false">
                <tr v-for="form in restockForms">
                    <td>{{ form.item_name }}</td>
                    <td>{{ form.restock_qty }}</td>
                    <td>{{ form.date.split("T")[0] }}</td>
                    <td><i @click="deleteRestockOrder(form.id)" class="bi bi-trash3-fill"></i></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr v-for="num in 5">
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
</template>

<style scoped>

</style>
