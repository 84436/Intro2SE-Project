import Vue from "vue";
import VueRouter from "vue-router";
import HomeUser from "../views/customer/Home.vue"

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: () =>
            import(
                /* webpackChunkName: "home" */
                "../views/Home.vue"
            ),
        children: [
            {
                path: "",
                component: () =>
                    import(
                        /* webpackChunkName: "onboardinghome" */
                        "../views/onboarding/Onboarding.vue"
                    ),
            },
            {
                path: "login",
                component: () =>
                    import(
                        /* webpackChunkName: "login" */
                        "../views/onboarding/Login.vue"
                    ),
            },
            {
                path: "register",
                component: () =>
                    import(
                        /* webpackChunkName: "register" */
                        "../views/onboarding/Register.vue"
                    ),
            },
        ],
    },
    {
        path: "/user",
        component: HomeUser,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
