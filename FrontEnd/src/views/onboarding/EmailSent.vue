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
                <p class="header">Check your inbox</p>
            </div>
        </div>
        <p id="description">
            An email was sent to your inbox. If it's not there, check your Junk
            folder.
        </p>
    </div>
</template>