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
import CartView from "../../components/Shop/CartView"

export default {
    components: {
        ShopAction,
        ShopDetails,
        Cart,
    },
};
</script>
