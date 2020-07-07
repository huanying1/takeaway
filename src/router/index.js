import Vue from 'vue'
import VueRouter from 'vue-router'
import MSite from "../views/msite/MSite"
import Order from '../views/order/Order'
import Profile from "../views/profile/Profile"
import Search from "../views/search/Search"
import Login from "../views/login/Login"

Vue.use(VueRouter)

  const routes = [
    {path:'/msite',component:MSite,meta:{showFooter:true}},
    {path:'/order',component:Order,meta:{showFooter:true}},
    {path:'/profile',component:Profile,meta:{showFooter:true}},
    {path:'/search',component:Search,meta:{showFooter:true}},
    {path:'/login',component:Login},
    {path:'/',redirect:'/msite'},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
