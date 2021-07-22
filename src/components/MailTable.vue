<template>
  <div class="container">
    <div class="mx-auto text-left ">
      <div
        class="navbar flex-sm-row align-items-sm-center flex-column-reverse align-items-start ps-2"
      >
        <ActionBar :emails="filteredEmails" />
        <div class="my-2 mr-auto me-md-0">
          <input
            v-model="searchQuery"
            class="form-control"
            type="search"
            placeholder="Search mail"
          />
        </div>
      </div>
      <ScreenBar @changeScreen="changeScreen" />
      <transition name="switch" mode="out-in">
        <transition-group
          v-if="filteredEmails.length"
          class="border-secondary"
          name="table"
          tag="div"
          appear
        >
          <ul
            :class="['clickable', email.read ? 'bg-light' : '']"
            class="d-flex align-items-center list-unstyled mb-1"
            v-for="email in filteredEmails"
            :key="email.id"
          >
            <li class="p-1">
              <input
                class="form-check-input"
                type="checkbox"
                @click="emailSelection.handleClick(email)"
                :checked="emailSelection.emails.has(email)"
              />
            </li>
            <li @click="handleOpen(email)" class="p-1 px-2 fw-bold">
              {{ email.from }}
            </li>
            <li @click="handleOpen(email)" class="p-1 subject m-0 fw-light text-truncate">
              {{ email.subject }}
            </li>
            <li @click="handleOpen(email)" class="date ms-auto p-1">
              {{ formattedTime(email.sentAt) }}
            </li>
          </ul>
        </transition-group>

        <div v-else>
          <p class="p-2 text-center border-secondary">
            {{ page == "inbox" ? "Inbox" : "Archive" }} do not have emails just yet...
          </p>
        </div>
      </transition>
      <transition name="switch" mode="out-in">
        <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
          <MailView :email="openedEmail" @changeEmail="changeEmail" />
        </ModalView>
      </transition>
      <a @click="closeWindow" class="btn btn-outline-secondary border chat-btn"
        ><img src="@/assets/img/chat-dots-fill.svg" />
      </a>
      <form class="wrapper d-none" ref="form">
        <div class="bg-info text-center p-2 mb-1">
          <span class="ms-4">Create new ximail!</span
          ><a @click="closeWindow" class="x-lg ms-5"><img src="@/assets/img/x-lg.svg" alt="x"/></a>
        </div>
        <div class="chat-form border border-top-0">
          <label for="name" class="form-label">Subject</label>
          <input type="text" class="form-control" v-model="subject" name="name" />
          <label for="name" class="form-label">Email</label>
          <input type="email" class="form-control" v-model="email" name="name" />
          <label for="name" class="form-label">Message</label>
          <textarea class="form-control" v-model="message" name="name"></textarea>
          <button @click.prevent="handleSubmit" class="btn btn-outline-secondary">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ScreenBar from "./ScreenBar.vue";
import ActionBar from "./ActionBar.vue";
import ModalView from "../components/ModalView";
import MailView from "../components/MailView";
import { useStore } from "vuex";
import { format } from "date-fns";
import { computed, ref } from "@vue/runtime-core";
import useDocument from "../composables/useDocument";
import useEmailSelection from "../composables/useEmailSelection";
import useCollection from "../composables/useCollection";
import { timestamp } from "../firebase/config";
export default {
  props: ["emails"],
  components: {
    MailView,
    ModalView,
    ActionBar,
    ScreenBar
  },
  setup(props) {
    const store = useStore();
    const user = computed(() => {
      return store.getters.getUser;
    });
    const openedEmail = ref(null);
    const emailSelection = useEmailSelection();
    const { addDoc } = useCollection("emails");
    const page = ref("inbox");
    const searchQuery = ref("");
    const form = ref(null);

    const subject = ref("");
    const email = ref("");
    const message = ref("");

    const closeWindow = () => {
      form.value.classList.toggle("d-none");
    };

    // create email
    const handleSubmit = async () => {
      try {
        await addDoc({
          archived: false,
          body: message.value,
          from: email.value,
          read: false,
          sentAt: timestamp(),
          subject: subject.value,
          userId: user.value.uid
        });
      } catch (err) {
        console.log(err.message);
      }
      closeWindow();
      email.value = "";
      subject.value = "";
      message.value = "";
    };

    const filteredEmails = computed(() => {
      if (page.value == "inbox") {
        return props.emails.filter(email => searchedEmails(email) && !email.archived);
      } else {
        return props.emails.filter(email => searchedEmails(email) && email.archived);
      }
    });

    const formattedTime = time => {
      return format(time.toDate(), "MMM do yyyy HH:mm");
    };

    const changeScreen = ({ screen }) => {
      if (screen == "inbox") {
        page.value = "inbox";
        emailSelection.clear();
      } else {
        page.value = "archived";
        emailSelection.clear();
      }
    };

    const searchedEmails = email => {
      return email.subject.toLowerCase().indexOf(searchQuery.value.toLowerCase()) != -1;
    };

    const handleOpen = email => {
      openedEmail.value = email;
      if (email) {
        email.read = true;
        updateEmail(email);
      }
    };

    const updateEmail = async email => {
      const { updateDoc } = useDocument("emails", email.id);
      await updateDoc({
        ...email
      });
    };

    const changeEmail = async ({ handleRead, handleArchived, save, closeModal, changeIndex }) => {
      const email = openedEmail.value;
      if (handleRead) {
        email.read = !email.read;
      }
      if (handleArchived) {
        email.archived = !email.archived;
      }
      if (save) {
        updateEmail(email);
      }
      if (closeModal) {
        openedEmail.value = null;
      }
      if (changeIndex) {
        const emails = filteredEmails.value;
        const currentIndex = emails.indexOf(openedEmail.value);
        const newEmail = emails[currentIndex + changeIndex];
        handleOpen(newEmail);
      }
    };

    return {
      emailSelection,
      openedEmail,
      closeWindow,
      filteredEmails,
      formattedTime,
      handleOpen,
      changeEmail,
      changeScreen,
      page,
      searchQuery,
      handleSubmit,
      email,
      subject,
      message,
      format,
      form
    };
  }
};
</script>

<style scoped>
ul {
  overflow: hidden;
}

.subject {
  flex-shrink: 3;
}

.table-enter-active,
.table-leave-active {
  transition: all 0.5s ease;
}
.table-enter-from,
.table-leave-to {
  opacity: 0;
}

.table-leave-active {
  display: none;
}

.table-move {
  transition: all 0.5s ease;
}

.chat-btn {
  position: absolute;
  right: 14px;
  bottom: 30px;
  cursor: pointer;
}

.chat-btn img {
  transition: all 0.15s ease;
}

#check:checked ~ .chat-btn img {
  display: block;
  pointer-events: auto;
}

.chat-btn {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  color: #fff;
  border: none;
}

.wrapper {
  position: absolute;
  right: 20px;
  bottom: 100px;
  background-color: #fff;
  transition: all 0.4s;
}

#check:checked ~ .wrapper {
  opacity: 1;
}

.chat-form {
  padding: 15px;
}

.chat-form input,
textarea,
button {
  margin-bottom: 10px;
}

.chat-form textarea {
  resize: none;
}

.form-control:focus,
.btn:focus {
  box-shadow: none;
}

#check {
  display: none !important;
}
</style>
