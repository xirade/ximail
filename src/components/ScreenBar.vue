<template>
  <div class="d-flex justify-content-end border-bottom border-secondary">
    <a class="btn mb-1  btn-outline-secondary text-dark border-end-0  border-bottom-0" @click="toInbox('inbox')">
      <img src="../assets/img/at.svg" alt="at" />
      <span>Inbox</span>
    </a>
    <a class="btn mb-1 btn-outline-secondary text-dark border-bottom-0" @click="toInbox('archive')">
      <img src="../assets/img/bookshelf.svg" alt="bookshelf" />
      <span>Archive</span>
    </a>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {
    const toInbox = async screen => {
      emit("changeScreen", { screen });
    };
    return {
      toInbox
    };
  }
};
</script>

<style scoped>
.btn {
  border-radius: 0;
}

.btn:hover span {
  color: white;
}
</style>
