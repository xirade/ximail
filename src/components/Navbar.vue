<template>
  <nav class="container my-5 d-flex justify-content-between align-items-center">
    <h1>
      <router-link class="text-decoration-none text-dark" :to="{ name: 'Home' }">
        Ximail
      </router-link>
    </h1>
    <div v-if="user">
      <span class="me-2"
        >Hi here, <strong>{{ user.displayName }}</strong>
      </span>
      <button class="btn btn-outline-secondary" @click="handleLogout">Logout</button>
    </div>
    <div v-else>
      <router-link :to="{ name: 'Signup' }" class="btn btn-outline-dark me-2">Sign up</router-link>
      <router-link :to="{ name: 'Login' }" class="btn btn-outline-primary me-2"
        >Sign in</router-link
      >
    </div>
  </nav>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "@vue/runtime-core";
export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.getUser);
    const router = useRouter();
    const handleLogout = () => {
      store
        .dispatch("logout")
        .then(() => {
          router.push({ name: "Login" });
        })
        .catch(err => {
          console.log(err.message);
        });
    };
    return { handleLogout, user };
  }
};
</script>
