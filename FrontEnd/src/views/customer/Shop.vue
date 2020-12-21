<template>
  <div id="content">
      <ShopAction />
      <ShopDetails />
  </div>
</template>

<script>
import ShopAction from "../../components/Shop/ShopAction"
import ShopDetails from "../../components/Shop/ShopDetails"

export default {
    components:{
        ShopAction,
        ShopDetails
    }
}
</script>