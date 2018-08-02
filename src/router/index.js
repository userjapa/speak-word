import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// COMPONENTS
const  Create = () => import(/* webpackChunkName: "Create" */ '@/pages/Create')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Create',
      component: Create
    }
  ]
})
