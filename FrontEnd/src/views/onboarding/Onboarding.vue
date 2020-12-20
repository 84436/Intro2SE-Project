<template>
    <div id="sidebar-content">
        <p class="header" id="onboarding-header">
            InTransit
        </p>
        <p id="description">The one-stop shop for food and grocery.</p>
        <div id="button-container">
            <router-link to="/login">
                <button class="btn" id="btn-sign-in">Sign in</button>
            </router-link>
            <router-link to="/register">
                <button class="btn" id="btn-sign-up">Sign up</button>
            </router-link>
            <router-link to="/customer">
                <button class="btn" id="btn-sign-up">Customer</button>
            </router-link>
        </div>
    </div>
</template>
