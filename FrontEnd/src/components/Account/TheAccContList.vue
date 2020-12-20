<template>
    <div id="account-content-container">
        <button class="each-content" v-on:click="passIndex(0)" v-bind:class="{ itemactive: activeIndex === 0}">
            <div class="content-icon">
                <i class="fal fa-info-circle"></i>
            </div>
            <div class="detail">
                About me
            </div>
        </button>
        <button class="each-content" v-on:click="passIndex(1)" v-bind:class="{ itemactive: activeIndex === 1}">
            <div class="content-icon">
                <i class="fal fa-key"></i>
            </div>
            <div class="detail">
                Change password
            </div>
        </button>
        <button class="each-content" v-on:click="passIndex(2)" v-bind:class="{ itemactive: activeIndex === 2}">
            <div class="content-icon">
                <i class="fal fa-store"></i>
            </div>
            <div class="detail">
                Open shop
            </div>
        </button>
        <button class="each-content" v-on:click="passIndex(3)" v-bind:class="{ itemactive: activeIndex === 3}">
            <div class="content-icon">
                <i class="fal fa-trash-alt"></i>
            </div>
            <div class="detail">
                Close account
            </div>
        </button>
        <button id="log-out-btn">
            <div id="log-out-icon">
                <i class="fal fa-sign-out"></i>
            </div>
            <div id="log-out-text">Log out</div>
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: 0,
        };
    },
    methods: {
        passIndex(index) {
            this.activeIndex = index;
            this.$emit("pass-index", this.activeIndex);
        },
    },
};
</script>
