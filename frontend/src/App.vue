<template>
    <div id="app">
        <router-view />
        <div class="bottom_bar">
            <div class="row expanded">
                <div class="sm-4 columns text-center">
                    <router-link to="/">
                        <i class="fa fa-home" aria-hidden="true"></i>
                        <span>Home</span>
                    </router-link>
                </div>
                <div class="sm-4 columns text-center">
                    <router-link to="/login" v-if="!this.$store.state.authorized">
                        <i class="fa fa-home" aria-hidden="true"></i>
                        <span>Login</span>
                    </router-link>
                    <router-link to="/login" v-else>
                        <i class="fa fa-home" aria-hidden="true"></i>
                        <span>Logout</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="js">
import { inject, toRefs } from "vue";
export default {
    name: "mainPage",
    props: {
        msg: String,
    },
    data() {
        return {
            user: "",
        };
    },
    mounted() {
        if(window.sessionStorage.getItem('AuthToken')) {
            this.$store.commit("setAuth", true);
            this.$gAuth.signIn();
        }
    },
    methods: {

    },
    setup(props) {
        const { isSignIn } = toRefs(props);
        const Vue3GoogleOauth = inject("Vue3GoogleOauth");
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const handleClickLogin = () => {};
        return {
            Vue3GoogleOauth,
            handleClickLogin,
            isSignIn,
        };
    },
};
</script>
<style lang="scss" src="./assets/scss/app.scss"></style>
