<template>
    <div id="list">
    <button class="each-content" v-on:click="passFrame('info')" v-bind:class="{ itemactive: activeFrame === 'info'}">
        <div class="content-icon">
            <i class="fal fa-info-circle"></i>
        </div>
        <div class="detail">
            About this shop
        </div>
    </button>
    <button class="each-content" v-on:click="passFrame('menu')" v-bind:class="{ itemactive: activeFrame === 'menu'}">
        <div class="content-icon">
            <i class="fal fa-list-alt"></i>
        </div>
        <div class="detail">
            Menu
        </div>
    </button>
    <button class="each-content" v-on:click="passFrame('coupon')" v-bind:class="{ itemactive: activeFrame === 'coupon'}">
        <div class="content-icon">
            <i class="fal fa-ticket"></i>
        </div>
        <div class="detail">
            Coupon
        </div>
    </button>
</div>
</template>

<script>
export default {
    data() {
        return {
            activeFrame: 'info',
        };
    },
    methods: {
        passFrame(frame) {
            this.activeFrame = frame;
            this.$emit("pass-frame", this.activeFrame);
        },
    },
};
</script>
