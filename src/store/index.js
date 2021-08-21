import { projectAuth, googleAuth } from "../firebase/config";
import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    error: ""
  },

  actions: {
    async signUp({ dispatch, state }, { email, password, displayName }) {
      try {
        if (!displayName.value.match(/[A-Za-z]{3,9}/)) {
          throw Error("Name field must contain only letters and limited to 9 characters");
        }
        if (password.value.length < 7) {
          throw Error("Password length is less 6 symbols");
        }
        const res = await projectAuth.createUserWithEmailAndPassword(email.value, password.value);
        if (!res) {
          throw new Error("Could not complete the signup");
        }
        await res.user.updateProfile({ displayName: displayName.value });
        const name = res.user.displayName;
        dispatch("setUser", {
          ...res.user,
          displayName: name
        });
      } catch (err) {
        state.error = err.message;
        console.log(err.message);
      }
    },
    async login({ dispatch, state }, { email, password }) {
      try {
        const res = await projectAuth.signInWithEmailAndPassword(email.value, password.value);
        dispatch("setUser", res.user);
      } catch (err) {
        state.error = err.message;
        console.log(err.message);
      }
    },
    async loginGoogle({ dispatch, state }) {
      const provider = new googleAuth.GoogleAuthProvider();
      try {
        const res = await projectAuth.signInWithPopup(provider);
        dispatch("setUser", res.user);
      } catch (err) {
        state.error = err.message;
        console.log(err.message);
      }
    },
    async logout({ commit, state }) {
      try {
        await projectAuth.signOut();
        commit("LOGOUT");
      } catch (err) {
        state.error = err.message;
        console.log(err.message);
      }
    },
    setUser({ commit }, user) {
      commit("SET_USER", user);
    }
  },

  mutations: {
    LOGOUT(state, user) {
      state.user = null;
    },
    SET_USER(state, currentUser) {
      state.user = currentUser;
    }
  },

  getters: {
    getUser(state) {
      return state.user;
    },
    getError(state) {
      return state.error;
    }
  }
});

export default store;
