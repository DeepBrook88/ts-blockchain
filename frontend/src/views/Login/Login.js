import { inject } from "vue";
export default {
    name: "loginScript",
    methods: {
        async handleClickSignIn() {
            try {
                const googleUser = await this.$gAuth.signIn();
                if (!googleUser) {
                    return null;
                }
                console.log("googleUser", googleUser);
                this.$parent.$parent.user = googleUser.getBasicProfile().getEmail();
                console.log("getId", this.$parent.$parent.user);
                console.log("getBasicProfile", googleUser.getBasicProfile());
                console.log("getAuthResponse", googleUser.getAuthResponse());
                console.log(
                    "getAuthResponse",
                    this.$gAuth.instance.currentUser.get().getAuthResponse()
                );
                window.sessionStorage.removeItem("AuthToken");
                window.sessionStorage.setItem("AuthToken", googleUser.getAuthResponse().access_token);
                this.$store.commit("setAuth", true);
                await this.$router.push({name: "Home"});
            } catch (error) {
                //on fail do something
                console.error(error);
                return null;
            }
        },
        async handleClickSignOut() {
            try {
                await this.$gAuth.signOut();
                console.log("isAuthorized", this.Vue3GoogleOauth.isAuthorized);
                this.$parent.$parent.user = "";
                window.sessionStorage.removeItem("AuthToken");
            } catch (error) {
                console.error(error);
            }
        },
    },
    setup() {
        const Vue3GoogleOauth = inject("Vue3GoogleOauth");
        return {
            Vue3GoogleOauth,
        };
    },
};
