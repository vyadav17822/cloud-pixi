import { createRouter, createWebHistory } from 'vue-router'
// import Header from '../components/Header.vue'
import LoadSuite from '../components/LoadSuite.vue'
import Content from '../components/Webshell.vue'
import Dashboard from '../components/Dashboard.vue'


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      name: 'Home',      
      path: '/',
      component: Dashboard
    },

    {
      name: 'LoadSuite',
      path: '/LoadSuite',
      component: LoadSuite
    },
    {
      name: 'shell',
      path: '/shell',
      component: Content
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: Dashboard
    },
    {
      name: 'Webshell',
      path: '/Webshell',
      component: Content
    }
  ]
})

export default router