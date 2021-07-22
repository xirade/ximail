<template>
  <div>
    <MailTable v-if="emails" :emails="emails" />
    <div v-if="error">
      Could not fetch the data
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import getCollection from "../composables/getCollection";
import { computed } from "@vue/runtime-core";
import MailTable from "../components/MailTable.vue";
export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.getUser);
    const { documents: emails, error } = getCollection("emails", ["userId", "==", user.value.uid]);
    return { error, emails };
  },
  components: {
    MailTable
  }
};
</script>
