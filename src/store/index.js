import { projectAuth, googleAuth } from "../firebase/config";
import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null
  },

  actions: {
    async signUp({ dispatch }, { email, password, displayName }) {
      try {
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
        console.log(err.message);
      }
    },
    async login({ dispatch }, { email, password }) {
      try {
        const res = await projectAuth.signInWithEmailAndPassword(email.value, password.value);
        dispatch("setUser", res.user);
      } catch (err) {
        console.log(err.message);
      }
    },
    async loginGoogle({ dispatch }) {
      const provider = new googleAuth.GoogleAuthProvider();
      try {
        const res = await projectAuth.signInWithPopup(provider);
        dispatch("setUser", res.user);
      } catch (err) {
        console.log(err.message);
      }
    },
    async logout({ commit }) {
      try {
        await projectAuth.signOut();
        commit("LOGOUT");
      } catch (err) {
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
    }
  }
});

export default store;
