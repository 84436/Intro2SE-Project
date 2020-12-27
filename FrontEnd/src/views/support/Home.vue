<template>
    <div id="app">
        <TheAdminNav />
        <router-view />
    </div>
</template>

<script>
import TheAdminNav from "../../components/Navigation/TheANavBar";

export default {
    components: {
        TheAdminNav,
    },
};
</script>
