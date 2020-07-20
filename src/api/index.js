import ajax from "./ajax"

let BASE_URL = 'http://localhost:4001/'
// 1、根据经纬度获取位置详情(#1根据经纬度获取位置详情)
export const reqAddress = async (geohash) => {
  let {data} = await ajax(`${BASE_URL}position/${geohash}`)
  return data
}

// 2、获取食品分类列表(#2获取食品分类列表)
export const reqFoodCategory = async () => {
  let {data} = await ajax(`${BASE_URL}index_category`)
  return data
}


// 3、根据经纬度获取商铺列表(#3根据经纬度获取商铺列表)
export const reqShops = async (longitude,latitude) => {
  let {data} = await ajax(`${BASE_URL}shops`,{longitude,latitude})
  return data
}

// 4、根据经纬度和关键字搜索商铺列表(#4根据经纬度和关键字搜索商铺列表)
export const reqSearchShops = async (geohash,keyword) => {
  let {data} = await ajax(`${BASE_URL}search_shops`,{geohash,keyword})
  return data
}

// 5、获取一次性验证码(#5获取一次性验证码)
export const reqCaptCha = async () => {
  let {data} = await ajax(`${BASE_URL}captcha`)
  return data
}
// 6、用户名密码登陆(#6用户名密码登陆)
export const reqPwdLogin = async ({name, pwd, captcha}) => {
  let {config,data} = await ajax(`${BASE_URL}login_pwd`, {name, pwd, captcha}, 'POST')
  return {config,data}
}
// 7、发送短信验证码(#7发送短信验证码)
export const reqSendCode = async (phone) => {
  let {data} = await ajax(`${BASE_URL}sendcode`,{phone})
  return data
}
// 8、手机号验证码登陆(#8手机号验证码登陆)
export const reqSmsLogin = async (phone,code) => {
  let {data} = await ajax(`${BASE_URL}login_sms`,{phone,code},'POST')
  return {data}
}
// 9、根据会话获取用户信息(#9根据会话获取用户信息)
export const reqUserInfo = async () => await ajax(`${BASE_URL}userinfo`)
// 10、用户登出(#10用户登出)
export const reqLogout = async () => {
  let {data} = await ajax(`${BASE_URL}Logout`)
  return data
}
//获取商家信息
export const reqShopInfo = async () => {
  let {data} = await ajax('/info')
  return data
}
//获取商家评价数组
export const reqShopRatings = async () => {
  let {data} = await ajax('/ratings')
  return data
}
//获取商家商品数组
export const reqShopGoods = async () => {
  let {data} = await ajax('/goods')
  return data
}