import { createStore } from "vuex";

export default createStore({
    state: {
        authorized: false,
    },
    mutations: {
        setAuth: (state, auth) => (state.authorized = auth),
    },
    actions: {},
    modules: {},
});
