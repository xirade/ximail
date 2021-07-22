<template>
  <div class="d-block modal">
    <div class="position-fixed overlay w-100 h-100" @click="emit('closeModal')"></div>
    <div class="modal-dialog position-relative">
      <div class="modal-content p-5 m-auto">
        <a @click="emit('closeModal')" class="ms-auto close"
          ><img src="@/assets/img/x-lg.svg" alt="x"></a>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import useKeydown from "../composables/useKeydown";
export default {
  setup(props, { emit }) {
    useKeydown([
      {
        key: "Escape",
        fn: () => {
          emit("closeModal");
        }
      }
    ]);
    return {
      emit
    };
  }
};
</script>

<style scoped>
.overlay {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
