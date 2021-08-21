<template>
  <Navbar />
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <transition name="slide" mode="out-in">
        <Suspense>
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            <div>
              <Loading />
            </div>
          </template>
        </Suspense>
      </transition>
    </template>
  </router-view>
</template>

<script>
import Loading from "./components/Loading.vue";
import Navbar from "./components/Navbar.vue";
export default {
  name: "App",
  components: {
    Loading,
    Navbar
  }
};
</script>

<style>
h1::before,
h1::after {
  content: url(./assets/img/x-diamond-fill.svg);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.slide-enter-active {
  transition: all 0.3s ease-out;
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.slide-leave-active {
  transition: all 0.3s ease-in;
}
</style>
