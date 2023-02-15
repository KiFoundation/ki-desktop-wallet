import Vue from 'vue';
import { createI18n } from 'vue-i18n';
import en from '@static/lang/en';
import util from './util';

/*
设置一下网站支持的语言种类
  */
var webLanguage = ['en'];

/**
 * 获取浏览器语言类型
 */
var getNavLanguage = function () {
  var navLanguage = navigator.language.toLowerCase();
  switch (navLanguage) {
    case 'zh-cn' || 'zh-tw' || 'zh-hk':
      navLanguage = 'cn';
      break;
    case 'ko':
      navLanguage = 'ko';
      break;
    default:
      navLanguage = 'en';
  }
  return navLanguage;
};

let i18n = createI18n({
  legacy: true,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
  },
});

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  console.log('It is not a string!');
}

/* i18n.setUserLanguage = function (lang) {
  if (isJSON(lang)) {
    lang = JSON.parse(lang).language;
  }
  if (!webLanguage.includes(lang)) {
    lang = 'en';
  }
  localStorage.setItem('userLanguage', lang, {
    expires: 30,
    path: '/',
  });
  i18n.locale = lang;
};

var cookieLang = localStorage.getItem('userLanguage')
  ? localStorage.getItem('userLanguage')
  : getNavLanguage();
i18n.setUserLanguage(cookieLang); */

export default i18n;
