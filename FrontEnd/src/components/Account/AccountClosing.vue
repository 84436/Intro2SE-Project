<template>
    <div id="detail-content-container">
        <form>
            <div class="form-control">
                <input
                    type="password"
                    class="input-field"
                    id="current-password"
                    placeholder="Current password"
                />
            </div>
        </form>
        <div id="confirm-btn-container">
            <button id="accept-btn" form="change-password-form">
                <i class="fal fa-check"></i>
                Close
            </button>
            <button id="cancel-btn" form="change-password-form">
                <i class="fal fa-times"></i>
                Cancel
            </button>
        </div>
    </div>

</template>