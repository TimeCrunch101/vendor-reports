<script setup>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { ref } from "vue";

const auth = useAuthStore()
const token = ref(auth.getToken)
const form = ref({
  name: null,
  consignment: 0.30,
  bm_ven_code: null
})

const emit = defineEmits(["update"])
const zeroize = () => {
  form.value.name = null
  form.value.consignment = null
  form.value.bm_ven_code = null
}

const addVendor = () => {
  axios.post("/api/v1/add/vendor",{
    name: form.value.name,
    consignment: form.value.consignment,
    bm_ven_code: form.value.bm_ven_code
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
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Add Vendor
</button>
<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <form @submit.prevent="addVendor()">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Vendor</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
           <div class="mb-3">
             <label for="name" class="form-label">Vendor Name</label>
             <input type="text" class="form-control" id="name" v-model="form.name">
           </div>
           <div class="mb-3">
             <label for="consignment" class="form-label">Consignment %</label>
             <input type="number" step="0.01" min="0" class="form-control" id="consignment" placeholder="0.30" v-model="form.consignment" required>
           </div>
           <div class="mb-3">
             <label for="bm_ven_code" class="form-label">Vendor Code</label>
             <input type="text" class="form-control" id="bm_ven_code" v-model="form.bm_ven_code">
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
