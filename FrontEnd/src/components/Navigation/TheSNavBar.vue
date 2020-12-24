<template>
    <div id="navbar">
        <div id="navbar-container">
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/shopowner/account' }">
                <router-link to="/shopowner/account">
                    <button>
                        <i class="fal fa-user-circle"></i>
                    </button>
                </router-link>
            </div>
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/shopowner/' }">
                <router-link to="/shopowner/">
                    <button>
                        <i class="fal fa-edit"></i>
                    </button>
                </router-link>
            </div>
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/shopowner/order' }">
                <router-link to="/shopowner/order">
                    <button>
                        <i class="fal fa-receipt"></i>
                    </button>
                </router-link>
            </div>
        </div>
    </div>
</template>
