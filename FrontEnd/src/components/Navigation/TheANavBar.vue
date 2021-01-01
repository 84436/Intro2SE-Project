<template>
    <div id="navbar">
        <div id="navbar-container">
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/support/' }">
                <router-link to="/support/">
                    <button>
                        <i class="fal fa-user-circle"></i>
                    </button>
                </router-link>
            </div>
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/support/request' }">
                <router-link to="/support/request">
                    <button>
                        <i class="fal fa-exclamation-circle"></i>
                    </button>
                </router-link>
            </div>
        </div>
    </div>    
</template>