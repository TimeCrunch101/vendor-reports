<script setup>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import {ref,reactive, onMounted} from "vue";


const auth = useAuthStore()
const token = ref(auth.getToken)
const items = ref(null)
const loading = ref(true)
const set = reactive({
    items,
    loading
})

const getItems = () => {
    axios.get("/api/v1/get/items",{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.items = res.data.allItems
        set.loading = false
    }).catch((err) => {
        console.error(err.response.data)
    })
}

const deleteItem = (id) => {
    if (confirm("Are you sure you want to delete this item? This action can not be reversed!")) {
        axios.post(`/api/v1/delete/item/${id}`,{},{
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        }).then((res) => {
            alert("Item Deleted")
            getItems()
        }).catch((err) => {
            console.error(err.response.data)
        })
    }
}

onMounted(() => {
    getItems()
})
</script>

<template>
    <div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Vendor Consignment</th>
                    <th scope="col">Vendor Code</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody v-if="loading === false">
                <tr v-for="item in items">
                    <td>{{ item.item_name }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.qty }}</td>
                    <td><router-link :to="`/vendor/${item.vendor_id}`">{{ item.vendor_name }}</router-link></td>
                    <td>{{ item.consignment }}</td>
                    <td>{{ item.bm_ven_code }}</td>
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