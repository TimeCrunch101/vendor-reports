<script setup>
import axios from "axios";
import { useAuthStore } from "../stores/auth.js";
import { useRoute } from "vue-router";
import { ref, onMounted, reactive } from "vue";

const auth = useAuthStore()
const token = ref(auth.getToken)
const route = useRoute()
const restockForms = ref(null)
const set = reactive({
    restockForms
})

const getRestockForms = () => {
    axios.get(`/api/v1/get/restock-forms/by-vendor/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.restockForms = res.data.restockForms
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
                    <th scope="col">ISBN</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="form in restockForms">
                    <td>{{ form.item_name }}</td>
                    <td>{{ form.restock_qty }}</td>
                    <td>{{ form.date.split("T")[0] }}</td>
                    <td>{{ form.isbn }}</td>
                    <td><i @click="deleteRestockOrder(form.id)" class="bi bi-trash3-fill"></i></td>
                </tr>
            </tbody>
        </table>
</template>

<style scoped>

</style>
