<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const form = ref({
    first_name: null,
    last_name: null,
    email: null,
    password: null
})

const register = () => {
    axios.post('/api/v1/register', {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        email: form.value.email,
        password: form.value.password
    }).then((res) => {
        form.value.password = null
        router.push('/login')
    }).catch((err) => {
        console.error(err)
        alert("COULD NOT REGISTER")
    })
}

const goLogin = () => {
    router.push("/login")
}

</script>

<template>
    <form @submit.prevent="register()">
        <div class="container mt-5">
            <h3 class="text-center">REGISTER</h3>
            <div class="form-floating mb-2">
                <input type="text" class="form-control" id="floatingInput" placeholder="First Name" v-model="form.first_name">
                <label for="floatingInput">First Name</label>
            </div>
            <div class="form-floating mb-2">
                <input type="text" class="form-control" id="floatingInput" placeholder="Last Name" v-model="form.last_name">
                <label for="floatingInput">Last Name</label>
            </div>
            <div class="form-floating mb-2">
                <input type="text" class="form-control" id="floatingInput" placeholder="email@example.com" v-model="form.email">
                <label for="floatingInput">Email</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="form.password">
                <label for="floatingPassword">Password</label>
            </div>
            <button class="btn btn-success mt-3" type="submit" style="margin-right: 3em;">Submit</button>
            <button @click="goLogin()" class="btn btn-primary mt-3" type="button">To Login</button>
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