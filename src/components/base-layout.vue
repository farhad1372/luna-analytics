<template>

    <div id="page-wrapper" :class="{ 'page-collapsed': reduce }">
        <div @click="reduce = !reduce" class="overlay"></div>
        <vs-sidebar top="100px" notShadow square :open="open" fixed :reduce="reduce" :hoverExpand="reduce">

            <template #logo>
                <div>
                    <img src="@/assets/coin.png" style="width : 32px; height : 32px  " />
                </div>
                <!-- ...img logo -->
            </template>

            <!-- <template #header>
                <h2 class="pt-0 pb-0 mb-4">Metric Panel</h2>
            </template> -->

            <vs-sidebar-item v-for="item in items" :key="item.to" :id="item.to" :to="{ name: item.to }"
                :class="{ 'active': $route.name === item.to }">
                <template #icon>
                    <i :class="item.icon"></i>
                </template>
                <span>{{ item.text }}</span>
            </vs-sidebar-item>

            <!-- <vs-sidebar-item :id="$route.name" :class="{ 'active': $route.name === 'Home' }" :to="{ name: 'Home' }">
                <template #icon>
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 12.2501C11.56 12.2501 11.12 12.1401 10.72 11.9301L4.21 8.4201C3.62 8.1001 3.25 7.4701 3.25 6.7701C3.25 6.0701 3.62 5.4401 4.21 5.1201L10.72 1.6101C11.52 1.1801 12.48 1.1801 13.27 1.6101L19.78 5.1201C20.37 5.4401 20.74 6.0701 20.74 6.7701C20.74 7.4701 20.37 8.1001 19.78 8.4201L13.27 11.9301C12.88 12.1501 12.44 12.2501 12 12.2501ZM12 2.7801C11.81 2.7801 11.61 2.8301 11.43 2.9301L4.93 6.4301C4.76 6.5201 4.75 6.7101 4.75 6.7701C4.75 6.8301 4.76 7.0201 4.93 7.1001L11.44 10.6101C11.8 10.8001 12.21 10.8001 12.57 10.6101L19.08 7.1001C19.24 7.0101 19.26 6.8201 19.26 6.7701C19.26 6.7101 19.25 6.5201 19.08 6.4401L12.57 2.9301C12.39 2.8301 12.19 2.7801 12 2.7801Z"
                            fill="currentColor" />
                        <path
                            d="M9.78 22.72C9.5 22.72 9.21 22.65 8.95 22.52L2.89 19.5C1.88 18.99 1.25 17.97 1.25 16.84V11.12C1.25 10.47 1.58 9.88001 2.13 9.54001C2.69 9.20001 3.36 9.17001 3.94 9.46001L10 12.48C11.01 12.99 11.64 14 11.64 15.14V20.86C11.64 21.51 11.31 22.1 10.76 22.44C10.46 22.63 10.12 22.72 9.78 22.72ZM3.11 10.76C3.03 10.76 2.96 10.79 2.92 10.81C2.86 10.85 2.75 10.94 2.75 11.12V16.84C2.75 17.4 3.06 17.91 3.56 18.16L9.61 21.19C9.77 21.27 9.9 21.21 9.96 21.18C10.02 21.14 10.13 21.05 10.13 20.87V15.15C10.13 14.59 9.82 14.08 9.32 13.83L3.27 10.8C3.21 10.77 3.16 10.76 3.11 10.76Z"
                            fill="currentColor" />
                        <path
                            d="M14.2194 22.72C13.8794 22.72 13.5394 22.63 13.2394 22.44C12.6894 22.1 12.3594 21.51 12.3594 20.86V15.14C12.3594 14.01 12.9894 12.99 13.9994 12.48L20.0494 9.45C20.6294 9.16 21.3094 9.19 21.8594 9.53C22.4094 9.87 22.7394 10.46 22.7394 11.11V16.83C22.7394 17.96 22.1094 18.98 21.0994 19.49L15.0494 22.52C14.7894 22.66 14.4994 22.72 14.2194 22.72ZM20.8894 10.76C20.8394 10.76 20.7894 10.77 20.7294 10.8L14.6794 13.83C14.1794 14.08 13.8694 14.58 13.8694 15.15V20.87C13.8694 21.05 13.9794 21.14 14.0394 21.18C14.0994 21.22 14.2294 21.27 14.3894 21.19L20.4394 18.16C20.9394 17.91 21.2494 17.4 21.2494 16.84V11.12C21.2494 10.94 21.1394 10.85 21.0794 10.81C21.0394 10.79 20.9694 10.76 20.8894 10.76Z"
                            fill="currentColor" />
                    </svg>

                </template>
                Home
            </vs-sidebar-item>
            <vs-sidebar-item :id="$route.name" :class="{ 'active': $route.name === 'Section-1' }"
                :to="{ name: 'Section-1' }">
                <template #icon>
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                            fill="currentColor" />
                        <path
                            d="M7.33011 15.24C7.17011 15.24 7.01011 15.19 6.87011 15.08C6.54011 14.83 6.48011 14.36 6.73011 14.03L9.11011 10.94C9.40011 10.57 9.81011 10.33 10.2801 10.27C10.7401 10.21 11.2101 10.34 11.5801 10.63L13.4101 12.07C13.4801 12.13 13.5501 12.13 13.6001 12.12C13.6401 12.12 13.7101 12.1 13.7701 12.02L16.0801 9.04001C16.3301 8.71001 16.8101 8.65001 17.1301 8.91001C17.4601 9.16001 17.5201 9.63001 17.2601 9.96001L14.9501 12.94C14.6601 13.31 14.2501 13.55 13.7801 13.6C13.3101 13.66 12.8501 13.53 12.4801 13.24L10.6501 11.8C10.5801 11.74 10.5001 11.74 10.4601 11.75C10.4201 11.75 10.3501 11.77 10.2901 11.85L7.91011 14.94C7.78011 15.14 7.56011 15.24 7.33011 15.24Z"
                            fill="currentColor" />
                    </svg>
                </template>
                Market Overview
            </vs-sidebar-item>
            <vs-sidebar-item id="Music">
                <template #icon>
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                            fill="currentColor" />
                        <path
                            d="M7.33011 15.24C7.17011 15.24 7.01011 15.19 6.87011 15.08C6.54011 14.83 6.48011 14.36 6.73011 14.03L9.11011 10.94C9.40011 10.57 9.81011 10.33 10.2801 10.27C10.7401 10.21 11.2101 10.34 11.5801 10.63L13.4101 12.07C13.4801 12.13 13.5501 12.13 13.6001 12.12C13.6401 12.12 13.7101 12.1 13.7701 12.02L16.0801 9.04001C16.3301 8.71001 16.8101 8.65001 17.1301 8.91001C17.4601 9.16001 17.5201 9.63001 17.2601 9.96001L14.9501 12.94C14.6601 13.31 14.2501 13.55 13.7801 13.6C13.3101 13.66 12.8501 13.53 12.4801 13.24L10.6501 11.8C10.5801 11.74 10.5001 11.74 10.4601 11.75C10.4201 11.75 10.3501 11.77 10.2901 11.85L7.91011 14.94C7.78011 15.14 7.56011 15.24 7.33011 15.24Z"
                            fill="currentColor" />
                    </svg>
                </template>
                Music
            </vs-sidebar-item>
            <vs-sidebar-item id="donate">
                <template #icon>
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                            fill="currentColor" />
                        <path
                            d="M7.33011 15.24C7.17011 15.24 7.01011 15.19 6.87011 15.08C6.54011 14.83 6.48011 14.36 6.73011 14.03L9.11011 10.94C9.40011 10.57 9.81011 10.33 10.2801 10.27C10.7401 10.21 11.2101 10.34 11.5801 10.63L13.4101 12.07C13.4801 12.13 13.5501 12.13 13.6001 12.12C13.6401 12.12 13.7101 12.1 13.7701 12.02L16.0801 9.04001C16.3301 8.71001 16.8101 8.65001 17.1301 8.91001C17.4601 9.16001 17.5201 9.63001 17.2601 9.96001L14.9501 12.94C14.6601 13.31 14.2501 13.55 13.7801 13.6C13.3101 13.66 12.8501 13.53 12.4801 13.24L10.6501 11.8C10.5801 11.74 10.5001 11.74 10.4601 11.75C10.4201 11.75 10.3501 11.77 10.2901 11.85L7.91011 14.94C7.78011 15.14 7.56011 15.24 7.33011 15.24Z"
                            fill="currentColor" />
                    </svg>
                </template>
                Donate
            </vs-sidebar-item>
            <vs-sidebar-item id="drink">
                <template #icon>
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                            fill="currentColor" />
                        <path
                            d="M7.33011 15.24C7.17011 15.24 7.01011 15.19 6.87011 15.08C6.54011 14.83 6.48011 14.36 6.73011 14.03L9.11011 10.94C9.40011 10.57 9.81011 10.33 10.2801 10.27C10.7401 10.21 11.2101 10.34 11.5801 10.63L13.4101 12.07C13.4801 12.13 13.5501 12.13 13.6001 12.12C13.6401 12.12 13.7101 12.1 13.7701 12.02L16.0801 9.04001C16.3301 8.71001 16.8101 8.65001 17.1301 8.91001C17.4601 9.16001 17.5201 9.63001 17.2601 9.96001L14.9501 12.94C14.6601 13.31 14.2501 13.55 13.7801 13.6C13.3101 13.66 12.8501 13.53 12.4801 13.24L10.6501 11.8C10.5801 11.74 10.5001 11.74 10.4601 11.75C10.4201 11.75 10.3501 11.77 10.2901 11.85L7.91011 14.94C7.78011 15.14 7.56011 15.24 7.33011 15.24Z"
                            fill="currentColor" />
                    </svg>
                </template>
                Drink
            </vs-sidebar-item> -->

            <!-- <template #footer>
                <vs-row justify="space-between">
                    <vs-avatar>
                        <img src="/avatars/avatar-5.png" alt="">
                    </vs-avatar>

                    <vs-avatar badge-color="danger" badge-position="top-right">
                        <i class='bx bx-bell'></i>

                        <template #badge>
                            28
                        </template>
                    </vs-avatar>
                </vs-row>
            </template> -->
        </vs-sidebar>

        <vs-navbar square fixed notShadow color="#fff" padding-scroll center-collapsed>
            <template #left>
                <div class="d-flex align-center pl-1 pl-lg-2">
                    <button @click="reduce = !reduce" class="toggle-sidebar-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#f0f" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 7.75H3C2.59 7.75 2.25 7.41 2.25 7C2.25 6.59 2.59 6.25 3 6.25H21C21.41 6.25 21.75 6.59 21.75 7C21.75 7.41 21.41 7.75 21 7.75Z"
                                fill="#292D32" />
                            <path
                                d="M21 12.75H3C2.59 12.75 2.25 12.41 2.25 12C2.25 11.59 2.59 11.25 3 11.25H21C21.41 11.25 21.75 11.59 21.75 12C21.75 12.41 21.41 12.75 21 12.75Z"
                                fill="#292D32" />
                            <path
                                d="M21 17.75H3C2.59 17.75 2.25 17.41 2.25 17C2.25 16.59 2.59 16.25 3 16.25H21C21.41 16.25 21.75 16.59 21.75 17C21.75 17.41 21.41 17.75 21 17.75Z"
                                fill="#292D32" />
                        </svg>
                    </button>

                    <h6 class="ml-3 sidebar-title">Luna Analytics</h6>
                </div>
            </template>
            <!-- <vs-navbar-item :active="active == 'guide'" id="guide">
                Guide
            </vs-navbar-item>
            <vs-navbar-item :active="active == 'docs'" id="docs">
                Documents
            </vs-navbar-item>
            <vs-navbar-item :active="active == 'components'" id="components">
                Components
            </vs-navbar-item>
            <vs-navbar-item :active="active == 'license'" id="license">
                license
            </vs-navbar-item> -->


            <template #right>
                <div class="d-flex align-center pr-1 pr-lg-3">
                    <!-- <vs-button flat>Login</vs-button> -->
                    <!-- <vs-button>Get Started</vs-button> -->
                </div>
            </template>
        </vs-navbar>

        <main class="pt-13">

            <div class="container pt-8">
                <vue-page-transition name="fade-in-up">
                    <router-view />
                </vue-page-transition>
                <!-- <HomeFooter /> -->
            </div>

        </main>
    </div>
</template>

<script>

export default {
    data() {
        return {
            active: "home",
            reduce: true,
            open: true,
            items: [
                { text: "Home", to: "Home", icon: "isax isax-home" },
                { text: "General", to: "General", icon: "isax isax-buy-crypto" },
                { text: "Total Supply & Circulating Supply", to: "Section-1", icon: "isax isax-chart-21" },
                { text: "Staked Luna", to: "Section-2", icon: "isax isax-chart-21" },
                { text: "Richlists", to: "Section-3", icon: "isax isax-chart-21" },
                { text: "Vesting Schedule", to: "Section-4", icon: "isax isax-chart-21" },
                { text: "The percentage of LUNA IBC", to: "Section-5", icon: "isax isax-chart-21" },
                { text: "Staked", to: "Section-6", icon: "isax isax-chart-21" },

                { text: "Refrences", to: "Refrences", icon: "isax isax-share" },
                { text: "Resources", to: "Resources", icon: "isax isax-shield-search" },

            ]
        };
    },
    components: {
        // HomeFooter: () => import("../components/footer.vue")
    },
    methods: {
        resizeHandler() {
            if (window.innerWidth > 1200) {
                // this.reduce = true;
            } else {
                this.reduce = true;
            }
        }
    },
    mounted() {
        window.addEventListener("resize", this.resizeHandler);
    },
    beforeMount() {
        this.resizeHandler();
    }
}
</script>

<style scoepd>

</style>