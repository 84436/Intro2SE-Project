<template>
    <div id="sidebar-content">
        <div id="head">
            <div>
                <router-link to="/">
                    <button class="redirect-button" id="back-button">
                        <i class="fal fa-angle-left fa-lg"></i>
                    </button>
                </router-link>
            </div>
            <div>
                <p class="header">Sign in</p>
            </div>
        </div>
        <ValidationObserver v-slot="{ handleSubmit }" tag="div">
            <form @submit.prevent="handleSubmit(login)">
                <ValidationProvider
                    name="Email"
                    rules="required|email"
                    v-slot="{ errors }"
                    tag="div"
                    class="form-control"
                >
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        autofocus
                        v-model="email"
                    />
                    <span class="form-error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                    name="Password"
                    rules="required"
                    v-slot="{ errors }"
                    tag="div"
                    class="form-control"
                >
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        v-model="password"
                    />
                    <span class="form-error">{{ errors[0] }}</span>
                </ValidationProvider>

                <div id="button-container">
                    <button class="btn" id="btn-submit-in" type="submit">
                        Let's go
                    </button>
                    <button class="btn" id="btn-help">Send help</button>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
import AccountService from "../../services/AccountService";
import store from "../../store/store";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods: {
        async login() {
            const response = await AccountService.login({
                email: this.email,
                password: this.password,
            });

            console.log(response);

            store.dispatch("setAccount", response.data);

            if (response.data.accountType === "customer") {
                this.$router.push("/customer/");
            } else if (response.data.accountType === "shopowner") {
                this.$router.push("/shopowner/");
            } else if (response.data.accountType === "admin") {
                this.$router.push("/admin/");
            }
        },
    },
};
</script>