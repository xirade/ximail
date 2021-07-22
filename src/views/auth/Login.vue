<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <div class="row p-5">
        <div class="login-form border bg-light border-secondary p-5 mx-auto">
          <h3 class="text-center">Login</h3>
          <div class="input-group mb-4 justify-content-center">
            <div class="input-group-prepend">
              <input class="form-control pe-5" type="email" placeholder="Email" v-model="email" />
            </div>
          </div>
          <div class="input-group mb-4 justify-content-center">
            <div class="input-group-prepend">
              <input
                class="form-control pe-5"
                type="password"
                placeholder="Password"
                v-model="password"
              />
            </div>
          </div>
          <div v-if="error" class="text-danger mb-2 text-center">{{ error }}</div>
          <div class="input-group mb-3 justify-content-center">
            <button @click.prevent="googleSignIn" class="btn btn-outline-dark pe-4">
              <img class="p-2 mb-1" src="@/assets/img/google.svg" />Sign in with google
            </button>
          </div>
          <div class="input-group justify-content-center">
            <button class="btn btn-outline-secondary">Sign in</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { computed } from '@vue/runtime-core';
import useCollection from '../../composables/useCollection';
import { timestamp } from '../../firebase/config';
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => {
      return store.getters.getUser;
    });
    const { addDoc } = useCollection("emails");

    const email = ref("");
    const password = ref("");
    const error = ref("");

    const googleSignIn = () => {
      store
        .dispatch("loginGoogle")
        .then(()=> {
          addDoc({
            archived: false,
            body: `Hey ${user.value.displayName},
            Welcome to Ximail. Your personal inbox service starts today.
            What happens next?
            Keep an eye on your inbox as we’ll be sending you the best tips for Ximail.
            Want to get more out of Ximail? Write me to email :)
            6myusic6@gmail.com`,
            from: "6myusic6@gmail.com",
            read: false,
            sentAt: timestamp(),
            subject: "Welcome to Ximail inbox",
            userId: user.value.uid
          });
        })
        .then(() => {
          console.log("Authorizetion complete!");
          router.push({ name: "Home" });
        })
        .catch(err => {
          console.log(err.message);
        });
    };

    const handleSubmit = () => {
      store
        .dispatch("login", { email, password })
        .then(() => {
          router.push({ name: "Home" });
        })
        .catch(err => {
          error.value = err.message;
          console.log(err.message);
        });
    };

    return { email, password, handleSubmit, googleSignIn, error };
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
}
</style>
