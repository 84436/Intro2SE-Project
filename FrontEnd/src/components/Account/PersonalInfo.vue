<template>
    <div id="detail-content-container">
        <div id="overview-info">
            <div id="avatar"></div>
            <button
                id="settings-btn"
                v-if="!this.editable"
                @click="changeEditState"
            >
                <i class="fal fa-user-edit"></i>
            </button>
            <div id="join-date">{{ this.account.joindate }}</div>
            <div id="email-info">{{ this.account.email }}</div>
        </div>
        <div id="detail-infomation" v-if="!this.editable">
            <div class="detail-information-container">
                <div class="display-label">Display Name</div>
                <div class="display-content" id="display-name">
                    {{ this.account.name }}
                </div>
            </div>
            <div class="detail-information-container">
                <div class="display-label">Phone Number</div>
                <div class="display-content" id="display-phone-number">
                    {{ this.account.phone }}
                </div>
            </div>
            <div class="detail-information-container">
                <div class="display-label">Address</div>
                <div class="display-content" id="display-name">
                    {{ this.account.address }}
                </div>
            </div>
        </div>
        <div id="info-form" v-else>
            <form>
                <div class="form-control">
                    <div class="display-label">Display Name</div>
                    <input
                        type="text"
                        class="input-field"
                        placeholder="Enter your name"
                        :value="this.account.name"
                    />
                </div>
                <div class="form-control">
                    <div class="display-label">Phone Number</div>
                    <input
                        type="text"
                        class="input-field"
                        placeholder="Enter your phone"
                        :value="this.account.phone"
                    />
                </div>
                <div class="form-control">
                    <div class="display-label">Address</div>
                    <input
                        type="text"
                        class="input-field"
                        placeholder="Enter your address"
                        :value="this.account.address"
                    />
                </div>
            </form>
            <div id="confirm-btn-container">
                <button id="accept-btn">
                    <i class="fal fa-check"></i>
                    Change
                </button>
                <button id="cancel-btn" @click="changeEditState">
                    <i class="fal fa-times"></i>
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import store from "../../store/store";

export default {
    data() {
        return {
            account: {
                joindate: this.getDate(),
                email: store.state.account.email,
                name: store.state.account.name,
                phone: store.state.account.phone,
                address: store.state.account.address,
            },
            editable: false,
        };
    },
    methods: {
        changeEditState() {
            if (this.editable === true) {
                this.editable = false;
            } else {
                this.editable = true;
            }
        },
        getDate() {
            var d = new Date(store.state.account.joinDate);
            return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        },
    },
};
</script>
