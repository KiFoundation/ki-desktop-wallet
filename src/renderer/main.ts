// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto';
import { createApp } from 'vue';
import router from './router';
import i18n from '@helpers/i18n';
import '@helpers/seedrandom';
import globalData from '@helpers/config';
import webCoin from '@helpers/coinUnit';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@static/css/index.css';
import '@static/css/rotating.animate.css';
import '@static/css/fade.animate.css';
import Unicon from 'vue-unicons';
import VueClipboard from 'vue-clipboard2';
import { ModalPlugin, ToastPlugin, BootstrapVue } from 'bootstrap-vue';
import Shimmer from 'vue3-shimmer';

import {
  uniWallet,
  uniPlusCircle,
  uniImport,
  uniCornerUpLeftAlt,
  uniArrowLeft,
  uniSync,
  uniExchange,
  uniCopy,
  uniLocationArrow,
  uniFileDownloadAlt,
  uniQuestionCircle,
} from 'vue-unicons/dist/icons';

import AppVue from './App.vue';
import { store } from './store';
import { colors } from '@helpers/colors';

const app = createApp(AppVue);

// Icons we need
Unicon.add([
  uniWallet,
  uniPlusCircle,
  uniImport,
  uniCornerUpLeftAlt,
  uniArrowLeft,
  uniSync,
  uniExchange,
  uniCopy,
  uniLocationArrow,
  uniFileDownloadAlt,
  uniQuestionCircle,
]);

app
  .use(router)
  .use(store)
  .use(i18n)
  .use(BootstrapVue)
  .use(VueClipboard)
  .use(ToastPlugin)
  .use(ModalPlugin)
  .use(Shimmer)
  .use(Unicon);

// Vue.config.productionTip = false;

app.provide('globalData', globalData);
app.provide('webCoin', webCoin);
app.provide('colors', colors);

// app.provide('accounts', accounts);

// actually mount to DOM
app.mount('#app');
app.config.warnHandler = (msg, instance, trace) => {
  // `trace` is the component hierarchy trace
};
