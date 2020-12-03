<template>
    <div id="sidebar-content">
        <div id="head">
            <div>
                <router-link to="/">
                    <button class="redirect-button" id="back-button">
                        <i class="fas fa-angle-left"></i>
                    </button>
                </router-link>
            </div>
            <div>
                <p class="header">Sign up</p>
            </div>
        </div>
        <div class="form">
            <input
                type="email"
                id="email"
                placeholder="Email"
                v-model="email"
            />
            <input
                type="text"
                id="name"
                placeholder="Full name"
                v-model="name"
            />
            <input
                type="text"
                id="address"
                placeholder="Address"
                v-model="address"
            />
            <input type="tel" id="phone" placeholder="Phone" v-model="phone" />
            <input
                type="password"
                id="password"
                placeholder="Password"
                v-model="password"
            />
            <input
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
                v-model="cfpassword"
            />
        </div>
        <div id="button-container">
            <button class="btn" id="btn-submit-up" @click="register">
                Next
            </button>
        </div>
    </div>
</template>

<script>
import AccountService from "../../services/AccountService";
import store from "../../store/store";

export default {
    data() {
        return {
            email: "",
            name: "",
            address: "",
            password: "",
            cfpassword: "",
            phone: "",
            error: null
        };
    },
    methods: {
        async register() {
            if(this.password !== this.cfpassword){
                // Error here
            }
            const respond = await AccountService.register({
                email: this.email,
                name: this.name,
                address: this.address,
                phone: this.phone,
                password: this.password,
            });

            store.dispatch("setToken", respond.data.token);
            store.dispatch("setType", respond.data.accountType);

            this.$router.push("/user");
        },
    },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Exo:wght@600&family=Montserrat&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
