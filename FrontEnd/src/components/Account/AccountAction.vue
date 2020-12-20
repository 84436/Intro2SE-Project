<template>
    <div id="list">
        <button class="each-content" v-on:click="passFrame('info')" v-bind:class="{ itemactive: activeFrame === 'info'}">
            <div class="content-icon">
                <i class="fal fa-info-circle"></i>
            </div>
            <div class="detail">
                About me
            </div>
        </button>
        <button class="each-content" v-on:click="passFrame('pass')" v-bind:class="{ itemactive: activeFrame === 'pass'}">
            <div class="content-icon">
                <i class="fal fa-key"></i>
            </div>
            <div class="detail">
                Change password
            </div>
        </button>
        <button class="each-content" v-on:click="passFrame('shop')" v-bind:class="{ itemactive: activeFrame === 'shop'}">
            <div class="content-icon">
                <i class="fal fa-store"></i>
            </div>
            <div class="detail">
                Open shop
            </div>
        </button>
        <button class="each-content" v-on:click="passFrame('close')" v-bind:class="{ itemactive: activeFrame === 'close'}">
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
