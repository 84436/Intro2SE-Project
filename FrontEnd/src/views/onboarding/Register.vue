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
                <p class="header">Sign up</p>
            </div>
        </div>
        <ValidationObserver v-slot="{ handleSubmit }" tag="div">
            <form @submit.prevent="handleSubmit(register)">
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
                        v-model="email"
                    />
                    <span class="form-error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                    name="Name"
                    rules="required|name"
                    v-slot="{ errors }"
                    tag="div"
                    class="form-control"
                >
                    <input
                        type="text"
                        id="name"
                        placeholder="Full name"
                        v-model="name"
                    />
                    <span class="form-error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                    name="Address"
                    rules="required"
                    v-slot="{ errors }"
                    tag="div"
                    class="form-control"
                >
                    <input
                        type="text"
                        id="address"
                        placeholder="Address"
                        v-model="address"
                    />
                    <span class="form-error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                    name="Phone"
                    rules="required|numeric"
                    v-slot="{ errors }"
                    tag="div"
                    class="form-control"
                >
                    <input
                        type="tel"
                        id="phone"
                        placeholder="Phone"
                        v-model="phone"
                    />
                    <span class="form-error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                    name="Password"
                    rules="required|confirmed:confirmation"
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

                <ValidationProvider
                    name="Confirmed Password"
                    vid="confirmation"
                    rules="required"
                    v-slot="{ errors }"
                    tag="div"
                    class="form-control"
                >
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="Confirm Password"
                    />
                    <span class="form-error">{{ errors[0] }}</span>
                </ValidationProvider>

                <div id="button-container">
                    <button class="btn" id="btn-submit-up" type="submit">
                        Next
                    </button>
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
            name: "",
            address: "",
            password: "",
            phone: "",
        };
    },
    methods: {
        async register() {
            const response = await AccountService.register({
                email: this.email,
                name: this.name,
                address: this.address,
                phone: this.phone,
                password: this.password,
            });

            store.dispatch("setAccount", response.data.token);

            this.$router.push("/customer");
        },
    },
};
</script>