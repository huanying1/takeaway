import Vue from 'vue'
import VueRouter from 'vue-router'

// import MSite from "../views/msite/MSite"
// import Order from '../views/order/Order'
// import Profile from "../views/profile/Profile"
// import Search from "../views/search/Search"

const MSite = () => import('../views/msite/MSite')
const Order = () => import('../views/order/Order')
const Profile = () => import('../views/profile/Profile')
const Search = () => import('../views/search/Search')

import Login from "../views/login/Login"
import Shop from "../views/shop/Shop"
import ShopGoods from "../views/shop/shopgoods/ShopGoods"
import ShopRatings from "../views/shop/shopratings/ShopRatings"
import ShopInfo from "../views/shop/shopinfo/ShopInfo"

Vue.use(VueRouter)

const routes = [
  {path: '/msite', component: MSite, meta: {showFooter: true}},
  {path: '/order', component: Order, meta: {showFooter: true}},
  {path: '/profile', component: Profile, meta: {showFooter: true}},
  {path: '/search', component: Search, meta: {showFooter: true}},
  {path: '/login', component: Login},
  {path: '/shop', component: Shop, children: [
    {
      path: '/shop/goods',
      component:ShopGoods
    },
    {
      path: '/shop/ratings',
      component:ShopRatings
    },
    {
      path: '/shop/info',
      component:ShopInfo
    },
    {path: '/', redirect: '/shop/goods'},
  ]},
  {path: '/', redirect: '/msite'},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
