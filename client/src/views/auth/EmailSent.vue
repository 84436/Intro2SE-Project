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
                <p class="header">Check your inbox</p>
            </div>
        </div>
        <p id="description">
            An email was sent to your inbox. If it's not there, check your Junk
            folder.
        </p>
    </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Exo:wght@600&family=Montserrat&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");
</style>
