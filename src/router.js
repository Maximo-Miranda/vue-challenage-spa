import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/Product')
        },
        {
            path: '/product',
            name: 'product',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/Product')
        },
        {
            path: '/login',
            name: 'login',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/Login')
        },
        {
            path: '/register',
            name: 'register',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/Register')
        }
    ]
})

export default router