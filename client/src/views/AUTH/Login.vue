<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from "../../stores/auth"
import { useRouter } from 'vue-router';
const router = useRouter()

const auth = useAuthStore()
const form = ref({})
const error = ref({
    message: null,
    cause: null
})

const login = () => {
    axios.post('/api/v1/login', {
        email: form.value.email,
        password: form.value.password
    }).then((res) => {
        auth.setUserInfo(res.data.first_name, res.data.last_name, res.data.email, res.data.token)
        router.push('/')
    }).catch((err) => {
        console.error(err)
        alert("COULD NOT LOG YOU IN")
    })
}

// const goRegister = () => {
//     router.push("/register")
// }

</script>

<template>
    <form @submit.prevent="login()">
        <div class="container mt-5">
            <h3 class="text-center">LOGIN</h3>
            <div class="form-floating mb-2">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="form.email">
                <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="form.password">
                <label for="floatingPassword">Password</label>
            </div>
            <button class="btn btn-success mt-3" type="submit" style="margin-right: 3em;">Login</button>
            <!-- <button @click="goRegister()" class="btn btn-primary mt-3" type="button">Register</button> -->
        </div>
    </form>
</template>

<style scoped>
.container {
    border: 5px solid rgb(91, 12, 238);
    border-radius: 1em;
    padding: 3em;
    width: 400px;
}

</style>