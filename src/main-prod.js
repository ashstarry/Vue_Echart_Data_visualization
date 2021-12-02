import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import echarts from 'echarts'

import './assets/css/global.less'

import './assets/font/iconfont.css'

import SocketService from './utils/socket_service'

SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance

// axios default url path
axios.defaults.baseURL = 'http://101.34.160.195:8888/api/'
Vue.prototype.$http = axios

// 把echarts挂载到 Vue prototype
Vue.prototype.$echarts = echarts
import './assets/lib/theme/chalk'
import './assets/lib/theme/westeros'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
