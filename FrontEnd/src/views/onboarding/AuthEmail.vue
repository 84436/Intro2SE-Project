<template>
    <div id="sidebar-content">
        <div id="head">
            <div>
                <router-link to="/login">
                    <button class="redirect-button" id="back-button">
                        <i class="fal fa-angle-left fa-lg"></i>
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
</style>
