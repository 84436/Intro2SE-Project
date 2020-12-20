<template>
    <div id="detail-content-container">
        <form>
            <div class="form-control">
                <input
                    type="password"
                    class="input-field"
                    id="old-password"
                    placeholder="Old password"
                />
            </div>
            <div class="form-control">
                <input
                    type="password"
                    class="input-field"
                    id="new-password"
                    placeholder="New password"
                />
            </div>
            <div class="form-control">
                <input
                    type="password"
                    class="input-field"
                    id="confirm-new-password"
                    placeholder="Confirm new password"
                />
            </div>
        </form>
        <div id="confirm-btn-container">
            <button id="accept-btn">
                <i class="fal fa-check"></i>
                Change
            </button>
            <button id="cancel-btn">
                <i class="fal fa-times"></i>
                Cancel
            </button>
        </div>
    </div>
</template>
