<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue';
import ThemePicker from "./ThemePicker.vue"

const route = useRoute()
const auth = useAuthStore();
const router = useRouter();
const currentPath = ref("/")
const set = reactive({
  currentPath
})

const logout = () => {
    auth.logout()
    router.push("/login")
}

const getPath = (currentPath) => {
  set.currentPath = currentPath
}

onMounted(() => {
  set.currentPath = route.fullPath
})

</script>

<template>
<nav v-if="auth.isAuthenticated" class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <router-link class="navbar-brand" to="/">&#10084&#x1F335;Prick Reports&#x1F335;&#10084</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link @click="getPath('/')" class="nav-link" :class="{'active' : currentPath === '/'}" aria-current="page" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link @click="getPath('/vendors')" class="nav-link" :class="{'active' : currentPath === '/vendors'}" aria-current="page" to="/vendors">Vendors</router-link>
        </li>
        <li class="nav-item">
          <router-link @click="getPath('/inventory')" class="nav-link" :class="{'active' : currentPath === '/inventory'}" aria-current="page" to="/inventory">Inventory</router-link>
        </li>
        <li class="nav-item">
          <router-link @click="getPath('/restocks')" class="nav-link" :class="{'active' : currentPath === '/restocks'}" aria-current="page" to="/restocks">Restocks</router-link>
        </li>
        <li class="nav-item">
          <router-link @click="getPath('/eom/reports')" class="nav-link" :class="{'active' : currentPath === '/eom/reports'}" aria-current="page" to="/eom/reports">EOM Reports</router-link>
        </li>
        <li class="nav-item">
          <router-link @click="logout()" class="nav-link" to="/login">Logout <i class="bi bi-box-arrow-right"></i></router-link>
        </li>
      </ul>
      <ThemePicker/>
    </div>
  </div>
</nav>
</template>
