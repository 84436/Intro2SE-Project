<template>
    <div id="sidebar-content">
        <div id="head">
            <div>
                <router-link to="/login">
                    <button class="redirect-button" id="back-button">
                        <i class="fas fa-angle-left"></i>
                    </button>
                </router-link>
            </div>
            <div>
                <p class="header">Forgot your password?</p>
            </div>
        </div>
        <div id="body">
            <div class="form">
                <input
                    type="email"
                    id="email"
                    placeholder="What is your email?"
                />
            </div>
            <div>
                <button class="redirect-button" id="forward-button">
                    <i class="fas fa-angle-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style scope>
@import url("https://fonts.googleapis.com/css2?family=Exo:wght@600&family=Montserrat&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
