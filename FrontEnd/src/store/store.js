import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,
    state: {
        account: {
            token: null,
            accountType: null,
            status: false,
        },
    },
    mutations: {
        setToken(state, token) {
            state.account.token = token;
            if (token) {
                state.account.status = true;
            }
            else {
                state.account.status = false;
            }
        },
        setType(state, type) {
            state.account.accountType = type;
        }
    },
    actions: {
        setToken({ commit }, token) {
            commit('setToken', token);
        },
        setType({ commit }, type) {
            commit('setType', type);
        }
    },
});

export default store;