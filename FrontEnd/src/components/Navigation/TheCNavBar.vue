<template>
    <div id="navbar">
        <div id="navbar-container">
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/customer/account' }">
                <router-link to="/customer/account">
                    <button>
                        <i class="fal fa-user-circle"></i>
                    </button>
                </router-link>
            </div>
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/customer/' }">
                <router-link to="/customer/">
                    <button>
                        <i class="fal fa-home-alt"></i>
                    </button>
                </router-link>
            </div>
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/customer/order' }">
                <router-link to="/customer/order">
                    <button>
                        <i class="fal fa-receipt"></i>
                    </button>
                </router-link>
            </div>
        </div>
    </div>
</template>
