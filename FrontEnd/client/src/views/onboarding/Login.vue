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
                <p class="header">Sign in</p>
            </div>
        </div>
        <div class="form">
            <input
                type="email"
                id="email"
                placeholder="Email"
                autofocus
                v-model="email"
            />
            <input
                type="password"
                id="password"
                placeholder="Password"
                v-model="password"
            />
        </div>
        <div id="button-container">
            <button class="btn" id="btn-submit-in" @click="login">
                Let's go
            </button>
            <button class="btn" id="btn-help">Send help</button>
        </div>
    </div>
</template>

<script>
import AccountService from "../../services/AccountService";

export default {
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods: {
        async login() {
            const respond = await AccountService.login({
                email: this.email,
                password: this.password,
            });
            console.log(respond);
        },
    },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Exo:wght@600&family=Montserrat&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
