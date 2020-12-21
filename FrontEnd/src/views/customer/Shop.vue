<template>
    <div id="content">
        <ShopAction />
        <ShopDetails />
        <Cart />
    </div>
</template>

<script>
import ShopAction from "../../components/Shop/ShopAction";
import ShopDetails from "../../components/Shop/ShopDetails";
import Cart from "../../components/Shop/Cart";

export default {
    components: {
        ShopAction,
        ShopDetails,
        Cart,
    },
};
</script>
