import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FastClick from 'fastclick'

import './mock/mockServer'
import loading from './common/imgs/loading.gif'
import 'mint-ui/lib/style.css'
import {Button} from 'mint-ui'
import VueLazyload from "vue-lazyload"
import './filters' //加载过滤器

Vue.component(Button.name, Button) //mt-button

FastClick.attach(document.body)

Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  loading,
})
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
