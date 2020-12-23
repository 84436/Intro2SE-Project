<template>
    <div id="content">
        <OrderAction />
        <OrderDetails />
    </div>
</template>

<script>
import OrderAction from "../../components/Order/OrderAction";
import OrderDetails from "../../components/Order/OrderDetails";
export default {
    components: {
        OrderAction,
        OrderDetails,
    },
};
</script>

<style>

</style>