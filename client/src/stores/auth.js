import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    first_name: null,
    last_name: null,
    email: null,
    token: null
  }),
  getters: {
    isAuthenticated: (store) => {
      if (store.token === null) return false
      else return true
    },
    getToken: (store) => {
      return store.token;
    },
    getUser: (store) => {
      return `${store.first_name} ${store.last_name}`
    },
  },
  actions: {
    setUserInfo(first_name, last_name, email, token) {
      this.first_name = first_name
      this.last_name = last_name
      this.email = email
      this.token = token
    },
    logout() {
      (this.first_name = null), (this.last_name = null), (this.email = null), (this.token = null);
    },
    validate() {
      return new Promise((resolve, reject) => {
        if (!this.token) return resolve(false)
        axios.get("/api/v1/validate", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          }).then((res) => {
            if (res.data.validation === true) resolve(true)
        }).catch((err) => {
            console.error(err)
            this.first_name = null
            this.last_name = null
            this.email = null
            this.token = null
            return resolve(false)
          });
      })
    }
  },
  persist: true,
});
