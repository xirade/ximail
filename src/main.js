import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"
import "./assets/main.css";
import { projectAuth } from "./firebase/config";

// init bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";


let app;
projectAuth.onAuthStateChanged(user => {
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(router)
      .mount("#app");
  }
  if(user) {  
    store.dispatch('setUser', user)
  }
});
