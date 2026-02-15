import { createRouter, createWebHistory } from 'vue-router'
import Basic from './views/basic.vue'
import Login from './views/login.vue'
import Register from './views/register.vue'

const routes = [
  { path: '/:catchAll(.*)', component: Basic },
  { path: '/login', component: Login, meta: { title: "sign in" } },
  { path: '/register', component: Register, meta: { title: "sign up" } },
  { path: '/profile', component: Basic },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => { 
  document.title = to.meta.title as string || "rooms"
})

export default router
