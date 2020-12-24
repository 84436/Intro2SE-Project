<template>
    <div id="content">
        <OrderAction />
        <OrderConfirm />
    </div>
</template>

<script>
import OrderAction from "../../components/Order/OrderAction";
import OrderConfirm from "../../components/Order/OrderConfirm";
export default {
    components: {
        OrderAction,
        OrderConfirm,
    },
};
</script>