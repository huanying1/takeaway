import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_GOODS,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from './mutation-types'

import {
  reqAddress,
  reqFoodCategory,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopGoods,
  reqShopInfo,
  reqShopRatings,
  reqSearchShops
} from '../api'

export default {
  //获取地址
  async getAddress({commit, state}) {
    const geohash = state.latitude + ',' + state.longitude
    let res = await reqAddress(geohash)
    if (res.code === 0) {
      const address = res.data
      commit(RECEIVE_ADDRESS, {address})
    }
  },
  //获取食品分类
  async getCategorys({commit}) {
    let res = await reqFoodCategory()
    if (res.code === 0) {
      const categorys = res.data
      commit(RECEIVE_CATEGORYS, {categorys})
    }
  },
  //获取商家列表
  async getShops({commit, state}) {
    let {latitude, longitude} = state
    let res = await reqShops(longitude, latitude)
    if (res.code === 0) {
      const shops = res.data
      commit(RECEIVE_SHOPS, {shops})
    }
  },
  //同步记录用户信息
  recordUser({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo})
  },
  //异步获取用户信息
  async getUserInfo({commit}) {
    const result = await reqUserInfo()
    if (result.code === 0) {
      const userInfo = result.data
      commit(RECEIVE_USER_INFO, {userInfo})
    }
  },

  //异步登出
  async logout({commit}) {
    const result = await reqLogout()
    if (result.code === 0) {
      commit(RESET_USER_INFO)
    }
  },
  //获取商家商品列表
  async getShopGoods({commit},cb) {
    const result = await reqShopGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_GOODS,{goods})
    }
    cb && cb()
  },
  //获取商家信息列表
  async getShopInfo({commit}) {
    const result = await reqShopInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RECEIVE_INFO,{info})
    }
  },
  //获取商家评价列表
  async getShopRatings({commit},cb) {
    const result = await reqShopRatings()
    if (result.code === 0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS,{ratings})
    }
    cb && cb()
  },
  //同步更新food中的count值
  updateFoodCount({commit},{isAdd,food}) {
    if (isAdd) {
      commit(INCREMENT_FOOD_COUNT,{food})
    }else {
      commit(DECREMENT_FOOD_COUNT,{food})
    }
  },
  //同步清空购物车
  clearCart({commit}) {
    commit(CLEAR_CART)
  },
  //异步获取搜索商家信息
  async searchShops({commit,state},keyword) {
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqSearchShops(geohash,keyword)
    if (result.code === 0) {
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS,{searchShops})
    }
  },
}