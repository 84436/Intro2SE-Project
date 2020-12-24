<template>
    <div id="app">
        <TheShopOwnerNav />
        <router-view />
    </div>
</template>

<script>
import TheShopOwnerNav from "../../components/Navigation/TheSNavBar";

export default {
    components: {
        TheShopOwnerNav,
    },
};
</script>
