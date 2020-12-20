<template>
    <div id="detail-content">
        <div id="detail-content-container">
            <form id="change-password-form">
                <input
                    type="password"
                    id="old-password"
                    placeholder="Old password"
                />
                <input
                    type="password"
                    id="new-password"
                    placeholder="New password"
                />
                <input
                    type="password"
                    id="confirm-new-password"
                    placeholder="Confirm new password"
                />
                <div id="change-pwd-btn-container">
                    <button id="change-btn">
                        <i class="fal fa-check"></i>
                        Change
                    </button>
                    <button id="cancel-btn">
                        <i class="fal fa-times"></i>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
