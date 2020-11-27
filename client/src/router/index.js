import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Onboarding from "../views/auth/Onboarding.vue";
import Login from "../views/auth/Login.vue"
import Register from "../views/auth/Register.vue"
import AuthEmail from "../views/auth/AuthEmail.vue"
import EmailSent from "../views/auth/EmailSent.vue"

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: Home,
        children: [
            {
                path: "",
                component: Onboarding
            },
            {
                path: "login",
                component: Login,
                
            },
            {
                path: "register",
                component: Register
            },
        ],
    },
];

const router = new VueRouter({
    routes,
});

export default router;
