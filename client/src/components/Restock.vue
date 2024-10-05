<script setup>
import axios from "axios";
import { useAuthStore } from "../stores/auth.js";
import { useRoute } from "vue-router";
import { ref, onMounted, reactive } from "vue";
import RestockList from "./RestockList.vue"

const auth = useAuthStore()
const token = ref(auth.getToken)
const route = useRoute()
const todaysDate = ref(null)
const itemList = ref(null)
const itemsToUpdate = ref([])
const showForm = ref(false)
const set = reactive({
    todaysDate,
    itemList,
    itemsToUpdate,
    showForm
})

const toggleForm = () => {
    if (showForm.value === true) {
        set.showForm = false
    } else {
        set.showForm = true
    }
}

const getItems = () => {
    axios.get(`/api/v1/get/items-by-vendor/${route.params.id}`,{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.itemList = res.data.itemList
    }).catch((err) => {
        console.error(err)
    })
}

const removeItemByID = (id) => {
    set.itemsToUpdate = itemsToUpdate.value.filter(item => item.id !== id);
}

const handleChange = (id, name, qty, event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
      console.log(`Item ID: ${id}, Checked: ${isChecked}, Item Name: ${name}`);
      set.itemsToUpdate.push({
        id: id,
        name: name,
        qty: qty,
        restockCount: 0,
        restockDate: todaysDate.value,
        isChecked: isChecked,
      })
  } else {
    removeItemByID(id)
  }
}

const submitRestockForm = () => {
    axios.post(`/api/v1/submit/restock-form/${route.params.id}`,{
        restockForm: itemsToUpdate.value
    },{
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    }).then((res) => {
        set.itemsToUpdate = []
        set.showForm = false
        const today = new Date().toISOString().split('T')[0];
        set.todaysDate = today
        getItems()
        alert("Success")
    }).catch((err) => {
        console.error(err)
    })
}

onMounted(() => {
    const today = new Date().toISOString().split('T')[0];
    set.todaysDate = today
    getItems()
})

</script>

<template>



<button @click="toggleForm()" class="btn btn-primary mt-3">Create Restock Order</button>

<div v-if="showForm">
    <div class="mb-3">
        <label for="restock-date">Restock Date</label>
        <input id="restock-date" class="form-control w-auto" type="date" :value="todaysDate"/>
    </div>
    <div class="my-class">
        <div class="mb-3 checkbox-group">
            <div v-for="(item, index) in itemList" :key="item.id" class="form-check">
                <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :value="item.id" 
                    :id="`item-${index}`"
                    @change="handleChange(item.id, item.item_name, item.qty, $event)">
                <label class="form-check-label" :for="`item-${index}`">
                    {{ item.item_name }}<span style="color: green"> | </span>{{ item.qty }}
                </label>
            </div>
        </div>
    </div>
    <div v-if="itemsToUpdate.length !== 0">
        <hr>
        <form @submit.prevent="submitRestockForm()">
            <button class="btn btn-success" type="submit">Submit</button>
            <div v-for="(item, index) in itemsToUpdate" :key="item.id">
                <span style="font-weight: 500;">{{ item.name }}</span>
                <div class="d-flex">
                    <input type="number" class="form-control form-control-sm ms-3" :value="item.qty" disabled readonly>
                    <input :id="item.id" type="number" min="0" class="form-control form-control-sm ms-3" :value="item.restockCount" v-model="item.restockCount">
                </div>
            </div>
        </form>
    </div>
</div>

<RestockList v-if="showForm !== true"/>


</template>

<style scoped>
.checkbox-group {
    /* border: 1px solid red; */
    width: max-content;
}
.my-class {
    display: flex;
    /* border: 1px solid green; */
}

.form-control-sm {
    width: 60px;
}

</style>
