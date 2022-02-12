import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import Home from "@/views/Home/Home.vue";
import Login from "@/views/Login/Login.vue";

function canActivate() {
    return window.sessionStorage.getItem("AuthToken");
}

const routes: Array<RouteRecordRaw> = [
    { path: "/", name: "Home", component: Home, meta: { auth: true } },
    { path: "/login", name: "Login", component: Login },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.auth && !canActivate()) {
        next("/login");
    }
    else {
        next();
    }
});

console.log("history", process.env.BASE_URL);

export default router;
