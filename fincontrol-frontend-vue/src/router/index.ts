import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../views/Dashboard.vue"
import Login from "../views/Login.vue"

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard },
    { path: '/login', component: Login },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = false; //TODO: replace with actual authentication check
    if (to.path !== '/login' && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router