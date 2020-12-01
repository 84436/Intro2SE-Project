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
            <input type="email" id="email" placeholder="Email" />
            <input type="password" id="password" placeholder="Password" />
            <input
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
            />
            <input type="tel" id="phone" placeholder="Phone" />
        </div>
        <div id="button-container">
            <button class="btn" id="btn-submit-up">Next</button>
        </div>
    </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Exo:wght@600&family=Montserrat&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
