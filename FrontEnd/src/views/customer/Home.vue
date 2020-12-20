<template>
    <div id="app">
        <TheCustomerNav />
        <router-view />
    </div>
</template>

<script>
import TheCustomerNav from "../../components/Navigation/TheCNavBar";

export default {
    components: {
        TheCustomerNav,
    },
};
</script>
