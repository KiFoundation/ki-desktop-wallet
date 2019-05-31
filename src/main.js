// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import i18n from 'static/js/i18n'
import webUtil from 'static/js/util'
import globalData from 'static/js/config.js'
import webCoin from 'static/js/coinUnit.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'static/css/index.css'
import clipboard from 'clipboard'
Vue.config.productionTip = false
Vue.use(vueResource)

/*注册到vue原型上*/
Vue.prototype.globalData = globalData;
Vue.prototype.clipboard = clipboard;
Vue.prototype.webUtil = webUtil;
Vue.prototype.webCoin = webCoin;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})