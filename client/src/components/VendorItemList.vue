<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "../stores/auth.js"
import { onMounted, ref, reactive } from "vue";
import AddItemModal from "./modals/AddItemModal.vue";
import axios from 'axios';
import { Tooltip } from "bootstrap";

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const token = ref(auth.getToken)
const vendor = ref(null)
const itemList = ref(null)
const tooltipButton = ref(null);
const edit = ref({
    status: false,
    items: []
})
const set = reactive({
  vendor,
  itemList,
  edit
})

const getItemList = () => {
    axios.get(`/api/v1/get/items-by-vendor/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.itemList = res.data.itemList
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

const updateQtyOH = () => {
    axios.post(`/api/v1/update/item/qty`,{
        itemsList: itemList.value
    },{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        getItemList()
        set.edit.status = false
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(() => {
    getItemList()
    const tooltip = new Tooltip(tooltipButton.value, {
    trigger: 'hover', // You can customize the trigger event
  });
})

const showEdit = (status) => {
    if (status === false) {
        getItemList()
    }
    set.edit.status = status
}
</script>

<template>

<div class="my-div">
    <AddItemModal @update="getItemList()"/>
    <button @click="getItemList()" class="btn btn-success mt-3"><i class="bi bi-arrow-clockwise"></i></button>
</div>

<div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr >
                    <th scope="col">Item</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity OH <i class="bi bi-info-circle" ref="tooltipButton" data-bs-toggle="tooltip" title="Only edit Quantity OH as a last resort"></i></th>
                    <th scope="col">ISBN</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemList" :id="item.id">
                    <td>{{ item.item_name }}</td>
                    <td>${{ item.price }}</td>
                    <td v-if="!edit.status">
                        {{ item.qty }} <i @click="showEdit(true)" class="bi bi-pencil-square"></i>
                    </td>
                    <td class="d-flex gap-1" v-else>
                        <input style="max-width: 70px;" class="form-control form-control-sm" type="number" step="1" name="qty" :id="`qty-${item.id}`" v-model="itemList[index].qty">
                        <i @click="showEdit(false)" class="bi bi-x-circle"></i>
                        <i @click="updateQtyOH()" class="bi bi-check-circle"></i>
                    </td>
                    <td>{{ item.isbn }}</td>
                    <td><i @click="deleteItem(item.id)" class="bi bi-trash3-fill"></i></td>
                </tr>
            </tbody>
        </table>
    </div>


</template>

<style scoped>
.my-div {
    display: flex;
    justify-content: space-between;
}
.bi-pencil-square:hover {
    cursor: pointer;
}
.bi-x-circle:hover {
    cursor: pointer;
}
.bi-pencil-square {
    color: green;
}
.bi-x-circle {
    color: rgb(190, 58, 58);
}
.bi-check-circle:hover  {
    cursor: pointer;
}
.bi-check-circle {
    color: green;
}
</style>
