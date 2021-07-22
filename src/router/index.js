import { createRouter, createWebHistory } from "vue-router";
import { projectAuth } from "../firebase/config";
import Login from "../views/auth/Login.vue";
import Signup from "../views/auth/Signup.vue";
import Home from "../views/Home.vue";

// route guard
const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (!user) {
    next({ name: "Login" });
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
