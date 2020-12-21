<template>
    <div id="list">
        <SearchBar />
        <ShopList />
    </div>
</template>

<script>
import SearchBar from "../Other/SearchBar";
import ShopList from "../Shop/ShopList";

export default {
    components:{
        SearchBar,
        ShopList
    }
};
</script>