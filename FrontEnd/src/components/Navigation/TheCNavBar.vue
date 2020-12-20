<template>
    <div id="navbar">
        <div id="navbar-container">
            <div class="navbar-btn">
                <button>
                    <i class="fal fa-user-circle"></i>
                </button>
            </div>
            <div class="navbar-btn">
                <button>
                    <i class="fal fa-home-alt"></i>
                </button>
            </div>
            <div class="navbar-btn">
                <button>
                    <i class="fal fa-receipt"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: 1
        };
    },
};
</script>
