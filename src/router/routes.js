import { createRouter, createWebHistory } from 'vue-router'
// import Header from '../components/Header.vue'
import UserSignin from '../components/UserSignin.vue'
import LoadSuits from '../components/LoadSuits.vue'
import Content from '../components/Content.vue'
import LogWindowV from '../components/LogWindowV.vue'
import UserSignUp from '@/components/UserSignUp.vue'


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      name: 'Home',      
      path: '/',
      component: LogWindowV
    },
    {
      name: 'signin',
      path: '/signin',
      component: UserSignin
    },
    {
      name: 'signup',
      path: '/signup',
      component: UserSignUp
    },
    {
      name: 'loadsuits',
      path: '/loadsuits',
      component: LoadSuits,
      // meta: {
      //   requiresAuth: true,
      // }
    },
    {
      name: 'shell',
      path: '/shell',
      component: Content,
      // meta: {
      //   requiresAuth: true,
      // }
    },
    {
      name: 'logWindow',
      path: '/dashboard',
      component: LogWindowV
    },
    {
      name: 'Webshell',
      path: '/Webshell',
      component: Content
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") === null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      if (to.matched.some((record) => record.meta.is_admin)) {
        next({ name: "dashboard" });
      } else {
        next();
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (localStorage.getItem("jwt") === null) {
      next();
    } else {
      next({ name: "dashboard" });
    }
  } else {
    next();
  }
})

export default router