import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/AUTH/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/AUTH/Register.vue')
    },
    {
      path: '/vendors',
      name: 'Vendors',
      component: () => import('../views/Vendors.vue')
    },
    {
      path: '/vendor/:id',
      name: 'Vendor',
      component: () => import('../views/Vendor.vue')
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const isValid = await useAuthStore().validate();
  switch (to.name) {
    case "Login":
      if (isValid) return next({name: from.name})
      next()
      break;
    case "Register":
      if (!isValid) {
        next()
      } else {
        return next({name: from.name})
      }
      break;
    default:
      if (isValid) {
        return next()
      } else {
        next({name: "Login"})
        break;
      }
  }
});

export default router
