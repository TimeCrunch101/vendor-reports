<script setup>
import { ref, onMounted } from 'vue';
const isDarkMode = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }
});

const toggleDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
};
</script>

<template>
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="darkModeSwitch" v-model="isDarkMode" @change="toggleDarkMode"/>
        <label class="form-check-label" for="darkModeSwitch">
            <i class="bi bi-moon-stars-fill"></i>
        </label>
    </div>
</template>