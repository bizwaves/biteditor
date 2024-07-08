import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/svgeditor',
    name: 'svgeditor',
    component: () => import('../views/SvgEditor.vue')
  },
  {
    path: '/svgviewer',
    name: 'svgviewer',
    component: () => import('../views/SvgViewer.vue')
  },    
  {
    path: '/config',
    name: 'config',
    component: () => import('../views/ConfigView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'home',
    component: HomeView
  }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
