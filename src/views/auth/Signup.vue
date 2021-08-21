<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <div class="row p-5">
        <div class="signup-form border bg-light border-secondary mx-auto p-5">
          <h3 class="text-center">Sign up</h3>
          <div class="input-group mb-4 justify-content-center">
            <div class="input-group-prepend">
              <input
                class="form-control pe-5"
                type="displayname"
                placeholder="Name"
                v-model="displayName"
              />
            </div>
          </div>
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
          <div class="input-group justify-content-center mb-1">
            <button class="btn btn-outline-secondary">Sign up</button>
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
import useCollection from "../../composables/useCollection";
import { computed } from "@vue/runtime-core";
import { timestamp } from "../../firebase/config";
export default {
  setup() {
    const store = useStore();
    const user = computed(() => {
      return store.getters.getUser;
    });
    const error = computed(() => {
      return store.getters.getError;
    });
    const router = useRouter();
    const { addDoc } = useCollection("emails");

    const email = ref("");
    const password = ref("");
    const displayName = ref("");

    const handleSubmit = async () => {
      await store
        .dispatch("signUp", { email, password, displayName })
        .then(() => {
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
          router.push({ name: "Home" });
        })
        .catch(err => {
          console.log(err.message);
        });
    };

    return { email, password, displayName, handleSubmit, error };
  }
};
</script>

<style scoped>
.signup-form {
  max-width: 400px;
}
</style>
