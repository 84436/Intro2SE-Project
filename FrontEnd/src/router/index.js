import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/store";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: () =>
            import(
                /* webpackChunkName: "onboardinghome" */
                "../views/onboarding/Home.vue"
            ),
        meta: {
            requiresAuth: false,
        },
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
        path: "/customer",
        component: () =>
            import(
                /* webpackChunkName: "customerhome" */
                "../views/customer/Home.vue"
            ),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: "",
                component: () =>
                    import(
                        /* webpackChunkName: "customershop" */
                        "../views/customer/Shop.vue"
                    ),
            },
            {
                path: "account",
                component: () =>
                    import(
                        /* webpackChunkName: "customeraccount" */
                        "../views/customer/Account.vue"
                    ),
            },
            {
                path: "order",
                component: () =>
                    import(
                        /* webpackChunkName: "customerorder " */
                        "../views/customer/Order.vue"
                    ),
            },
        ],
    },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.state.status) {
            next();
        }
    } else {
        if (store.state.status) {
            if (store.state.account.accountType === "customer") {
                next("/customer/");
            } else if (store.state.account.accountType === "shopowner") {
                next("/shopowner/");
            } else if (store.state.account.accountType === "admin") {
                next("/admin/");
            }
        } else {
            next();
        }
    }
});

export default router;
