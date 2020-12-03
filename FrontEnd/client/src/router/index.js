import Vue from "vue";
import VueRouter from "vue-router";
import HomeUser from "../views/customer/Home.vue"
import store from "../store/store"

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: () =>
            import(
                /* webpackChunkName: "home" */
                "../views/Home.vue"
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
        path: "/user",
        component: HomeUser,
        meta: {
            requiresAuth: true,
        },
    },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.state.account.status) {
            if (store.state.account.accountType === 'customer') {
                next();
            }
        }

    } else {
        if (store.state.account.status) {
            if (store.state.account.accountType === "customer") {
                next('/user');
            }
        }
        else {
            next()
        }
    }
})

export default router;
