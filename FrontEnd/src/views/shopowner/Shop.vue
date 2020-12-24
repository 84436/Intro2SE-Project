<template>
    <div id="content">
        <ShopOwnerAction v-on:pass-frame="updateframe" />
        <div id="details">
            <ShopInfo v-if="activeFrame === 'info'" />
            <Menu v-if="activeFrame === 'menu'" />
            <Coupon v-if="activeFrame === 'coupon'" />
        </div>
    </div>
</template>

<script>
import ShopOwnerAction from "../../components/ShopOwner/ShopOwnerAction";
import ShopInfo from "../../components/ShopOwner/ShopInfo";
import Menu from "../../components/ShopOwner/Menu";
import Coupon from "../../components/ShopOwner/Coupon";

export default {
    data() {
        return {
            activeFrame: 'info',
        };
    },
    components: {
        ShopOwnerAction,
        ShopInfo,
        Menu,
        Coupon,
    },
    methods: {
        updateframe(frame) {
            this.activeFrame = frame;
        },
    },
};
</script>
