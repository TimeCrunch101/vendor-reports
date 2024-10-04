<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "../stores/auth.js"
import { onMounted, ref, reactive } from "vue";
import AddItemModal from "./modals/AddItemModal.vue";
import axios from 'axios';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const token = ref(auth.getToken)
const vendor = ref(null)
const itemList = ref(null)
const loading = ref(true)
const set = reactive({
  vendor,
  itemList,
  loading
})

const getItemList = () => {
    axios.get(`/api/v1/get/items-by-vendor/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.itemList = res.data.itemList
        set.loading = false
    }).catch((err) => {
        console.error(err.response.data)
    })
}

const deleteItem = (id) => {
    axios.post(`/api/v1/delete/item/${id}`,{},{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        alert("Item Deleted")
        getItemList()
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(() => {
    getItemList()
})

</script>

<template>

<AddItemModal @update="getItemList()"/>

<div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr >
                    <th scope="col">Item</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity OH</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody v-if="loading === false">
                <tr v-for="item in itemList">
                    <td>{{ item.item_name }}</td>
                    <td>${{ item.price }}</td>
                    <td>{{ item.qty }}</td>
                    <td><i @click="deleteItem(item.id)" class="bi bi-trash3-fill"></i></td>
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
    </div>


</template>

<style scoped>
.bi-trash3-fill {
    color: rgb(255, 72, 72)
}
.bi-trash3-fill:hover {
    cursor: pointer;
}
</style>
