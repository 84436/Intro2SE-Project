import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,
    state: {
        account: null,
        status: false
    },
    mutations: {
        setAccount(state, account) {
            state.account = account;
            if (account.token) {
                state.status = true;
            }
        }
    },
    actions: {
        setAccount({ commit }, account) {
            commit('setAccount', account);
        }
    },
});

export default store;