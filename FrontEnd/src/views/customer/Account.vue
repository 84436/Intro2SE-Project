<template>
    <div id="content">
        <TheAccContList v-on:pass-index="updateIndex"/>
        <ThePersonalInfo v-if="activeIndex === 0" />
        <TheChangePass v-if="activeIndex === 1" />
    </div>
</template>

<script>
import TheAccContList from "../../components/Account/TheAccContList";
import ThePersonalInfo from "../../components/Account/ThePersonalInfo";
import TheChangePass from "../../components/Account/TheChangePass"

export default {
    data() {
        return {
            activeIndex: 0,
        };
    },
    components: {
        TheAccContList,
        ThePersonalInfo,
        TheChangePass
    },
    methods: {
        updateIndex(index) {
            this.activeIndex = index;
        },
    },
};
</script>
