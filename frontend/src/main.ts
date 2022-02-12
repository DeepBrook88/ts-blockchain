import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import gAuthPlugin from "vue3-google-oauth2";

const gAuthClientId = "423341442729-nqj3s1j0vqcudaa59402ubmt4m94slh6.apps.googleusercontent.com";
createApp(App)
    .use(gAuthPlugin, {
        clientId: gAuthClientId,
        scope: "email",
        prompt: "consent",
        fetch_basic_profile: false,
    })
    .use(router)
    .use(store)
    .mount("#app");
