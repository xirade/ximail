<template>
  <div class="text-left">
    <div class="btn-group btn-group-sm">
      <button
        v-if="!email.archived"
        @click="handleArchived(email)"
        class="btn btn-outline-dark me-2"
      >
        <img src="../assets/img/archive.svg" alt="archive" />
        Archived (A)
      </button>
      <button v-else @click="handleArchived(email)" class="btn btn-outline-dark me-2">
        <img src="../assets/img/at.svg" alt="at" />
        Move to Inbox (A)
      </button>
    </div>
    <div class="modal-header ps-0">
      <h2 class="mb-0 modal-title">
        <strong class="fw-bold"> {{ email.subject }} </strong>
      </h2>
    </div>
    <div class="fw-lighter my-3">
      <em>
        From {{ email.from }}
        <br />
        on <strong>{{ formattedTime(email.sentAt) }}</strong>
      </em>
    </div>
    <div class="modal-body ps-0 lh-lg" v-html="markDown" />
    <div class="modal-footer">
      <button @click="goPrev" class="btn btn-outline-dark">
        <img src="../assets/img/arrow-left.svg" alt="arrow left" />
      </button>
      <button @click="goNext" class="btn btn-outline-dark me-2">
        <img src="../assets/img/arrow-right.svg" alt="arrow right" />
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { format } from "date-fns";
import marked from "marked";
import useKeydown from "../composables/useKeydown";
export default {
  props: ["email"],
  setup(props, { emit }) {
    const email = props.email;
    const formattedTime = time => {
      return format(time.toDate(), "MMM do yyyy HH:mm");
    };

    const markDown = computed(() => marked(email.body));
    const handleArchived = async () => {
      emit("changeEmail", { handleArchived: true, save: true, closeModal: true });
    };

    const goNext = async () => {
      emit("changeEmail", { changeIndex: -1 });
    };

    const goPrev = async () => {
      emit("changeEmail", { changeIndex: 1 });
    };

    const goNextAndArchived = async () => {
      emit("changeEmail", { changeIndex: -1, handleArchived: true, save: true });
    };

    const goPrevAndArchived = async () => {
      emit("changeEmail", { changeIndex: 1, handleArchived: true, save: true });
    };

    useKeydown([
      {
        key: "a",
        fn: handleArchived
      },
      {
        key: "ArrowRight",
        fn: goNext
      },
      {
        key: "ArrowLeft",
        fn: goPrev
      },
      {
        key: "[",
        fn: goNextAndArchived
      },
      {
        key: "]",
        fn: goPrevAndArchived
      }
    ]);
    return {
      formattedTime,
      markDown,
      handleArchived,
      goNext,
      goPrev
    };
  }
};
</script>
