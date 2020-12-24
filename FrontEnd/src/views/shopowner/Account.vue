<template>
    <div id="content">
        <AccountAction v-on:pass-frame="updateframe" />
        <div id="details">
            <PersonalInfo v-if="activeFrame === 'info'" />
            <PassChanging v-if="activeFrame === 'pass'" />
            <ShopOpening v-if="activeFrame === 'shop'" />
            <AccountClosing v-if="activeFrame === 'close'" />
        </div>
    </div>
</template>

<script>
import AccountAction from "../../components/Account/AccountAction";
import PersonalInfo from "../../components/Account/PersonalInfo";
import PassChanging from "../../components/Account/PassChanging";
import ShopOpening from "../../components/Shop/ShopOpening";
import AccountClosing from "../../components/Account/AccountClosing";

export default {
    data() {
        return {
            activeFrame: 'info',
        };
    },
    components: {
        AccountAction,
        PersonalInfo,
        PassChanging,
        ShopOpening,
        AccountClosing,
    },
    methods: {
        updateframe(frame) {
            this.activeFrame = frame;
        },
    },
};
</script>
