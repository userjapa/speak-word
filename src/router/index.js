import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// COMPONENTS
const  Create = () => import(/* webpackChunkName: "Create" */ '@/pages/Create')
const Preview = () => import(/* webpackChunkName: "Create" */ '@/pages/Preview')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Create',
      component: Create
    },
    {
      path: '/preview',
      name: 'Preview',
      component: Preview
    }
  ]
})
