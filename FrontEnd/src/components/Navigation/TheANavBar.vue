<template>
    <div id="navbar">
        <div id="navbar-container">
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/support/' }">
                <button>
                    <i class="fal fa-user-circle"></i>
                </button>
            </div>
            <div class="navbar-btn" v-bind:class="{ navactive: $route.path === '/support/request' }">
                <button>
                    <i class="fal fa-exclamation-circle"></i>
                </button>
            </div>
        </div>
    </div>    
</template>