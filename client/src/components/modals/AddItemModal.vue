<script setup>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { ref } from "vue";


const route = useRoute()
const auth = useAuthStore()
const token = ref(auth.getToken)
const form = ref({
  item_name: null,
  price: null,
  qty: null
})

const emit = defineEmits(["update"])
const zeroize = () => {
  form.value.item_name = null
  form.value.price = null
  form.value.qty = null
}

const addItem = () => {
  axios.post(`/api/v1/add/item-to-vendor/${route.params.id}`,{
    item_name: form.value.item_name,
    price: form.value.price,
    qty: form.value.qty
  }, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  }).then((res) => {
    zeroize()
    emit("update")
  }).catch((err) => {
    zeroize()
    console.error(err)
  })

}

</script>

<template>
<!-- Button trigger modal -->
<button type="button" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Add Item
</button>
<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <form @submit.prevent="addItem()">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Item</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
           <div class="mb-3">
             <label for="item_name" class="form-label">Item Name</label>
             <input type="text" class="form-control" id="item_name" v-model="form.item_name" required>
           </div>
           <div class="mb-3">
             <label for="price" class="form-label">Price</label>
             <input type="number" step="0.01" min="0" class="form-control" id="price" v-model="form.price" required>
           </div>
           <div class="mb-3">
             <label for="qty" class="form-label">Quantity</label>
             <input type="number" step="1" min="1" class="form-control" id="qty" v-model="form.qty" required>
           </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </form>
  </div>
</div>
</template>
