import Vue from "vue";
import VueRouter from "vue-router";
import HomeLayout from "../components/base-layout.vue";
import Home from "../pages/home.vue";
Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: HomeLayout,
        children: [
            {
                path: "",
                name: "Home",
                component: Home,
                meta: {
                    next: {
                        text: "Section 1: Total Supply & Circulating Supply",
                        link: "Section-1"
                    }, prev: null
                }
            },
            {
                path: "section-1/total-supply-&-circulating-supply",
                name: "Section-1",
                component: () => import("../pages/sections/section1.vue"),
                meta: {
                    next: {
                        text: "Section 2: Staked LUNA",
                        link: "Section-2"
                    },
                    prev: {
                        text: "Home Introduction",
                        link: "Home"
                    }
                }
            },
            {
                path: "general",
                name: "General",
                component: () => import("../pages/sections/general.vue")
            },
            {
                path: "section-2",
                name: "Section-2",
                component: () => import("../pages/sections/section2.vue")
            },
            {
                path: "section-3",
                name: "Section-3",
                component: () => import("../pages/sections/section3.vue")
            },
            {
                path: "section-4",
                name: "Section-4",
                component: () => import("../pages/sections/section4.vue")
            },
            {
                path: "section-5",
                name: "Section-5",
                component: () => import("../pages/sections/section5.vue")
            },
            {
                path: "section-6",
                name: "Section-6",
                component: () => import("../pages/sections/section6.vue")
            },

            {
                path: "refrences",
                name: "Refrences",
                component: () => import("../pages/refrences.vue")
            },

            {
                path: "resources",
                name: "Resources",
                component: () => import("../pages/resources.vue")
            },


        ]
    },
    {
        path: "*",
        redirect: { name: "404" }
    },
    {
        path: "/not-found/404",
        component: () => import("../pages/errors/404.vue"),
        name: "404"
    }

];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    // base: "",
    routes,
    scrollBehavior() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0, behavior: "smooth" });
            }, 100);
        });
    },
});








export default router;
