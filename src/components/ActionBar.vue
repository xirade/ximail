<template>
  <div class="d-flex me-5">
    <input
      class="me-3 form-check-input"
      type="checkbox"
      :checked="allEmailsSelected && emails.length != 0"
      @click="handleSelectAll"
      :disabled="emails.length == 0"
    />
    <div class="ms-md-0 mx-auto">
      <button
        v-if="[...emailSelection.emails].every(email => !email.read)"
        class="me-3 btn btn-outline-secondary"
        @click="emailSelection.markRead()"
        :disabled="[...emailSelection.emails].every(email => email.read)"
        title="Mark Read"
      >
        <img src="../assets/img/envelope-close.svg" alt="read" />
      </button>
      <button
        title="Mark Unread"
        v-else
        class="me-3 btn btn-outline-secondary"
        @click="emailSelection.markUnread()"
      >
        <img src="../assets/img/envelope-open.svg" alt="read" />
      </button>
      <button
        v-if="[...emailSelection.emails].every(email => !email.archived)"
        title="Archive"
        class="me-3 btn btn-outline-secondary"
        @click="emailSelection.archive()"
        :disabled="[...emailSelection.emails].every(email => email.archived)"
      >
        <img src="../assets/img/archive.svg" alt="archive" />
      </button>
      <button
        v-else
        title="Unarchive"
        class="me-3 btn btn-outline-secondary"
        @click="emailSelection.unarchive()"
      >
        <img src="../assets/img/unarchive.svg" alt="unarchive" />
      </button>
      <button title="Delete" class="btn btn-outline-secondary" @click="emailSelection.remove()" :disabled="numberSelected == 0">
        <img src="../assets/img/trash.svg" alt="trash" />
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import useEmailSelection from "../composables/useEmailSelection";
export default {
  props: ["emails"],
  setup(props) {
    const emailSelection = useEmailSelection();
    const numberSelected = computed(() => emailSelection.emails.size);
    const numberEmails = computed(() => props.emails.length);
    const allEmailsSelected = computed(() => numberSelected.value === numberEmails.value);
    const handleSelectAll = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(props.emails);
      }
    };
    return {
      allEmailsSelected,
      numberSelected,
      handleSelectAll,
      emailSelection
    };
  }
};
</script>
