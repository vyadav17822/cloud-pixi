import { createRouter, createWebHistory } from 'vue-router'
// import Header from '../components/Header.vue'
import LoadSuits from '../components/LoadSuits.vue'
import Content from '../components/Content.vue'
import LogWindowV from '../components/LogWindowV.vue'


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      name: 'Home',      
      path: '/',
      component: LogWindowV
    },

    {
      name: 'loadsuits',
      path: '/loadsuits',
      component: LoadSuits
    },
    {
      name: 'shell',
      path: '/shell',
      component: Content
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

export default router