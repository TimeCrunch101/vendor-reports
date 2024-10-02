<script setup>
import {useAuthStore} from "../stores/auth.js"
import {useRouter} from "vue-router"
const router = useRouter()
const auth = useAuthStore()


const logout = () => {
    auth.logout()
    router.push("/login")
}

</script>

<template>
<h1>HELLO WORLD</h1>
<button @click="logout()">LOGOUT</button>
</template>
