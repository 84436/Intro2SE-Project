<template>
    <div id="content">
        <RequestAction />
        <RequestDetails />
    </div>
</template>

<script>
import RequestAction from "../../components/Request/RequestAction"
import RequestDetails from "../../components/Request/RequestDetails"

export default {
    components: {
        RequestAction,
        RequestDetails,
    },
}
</script>