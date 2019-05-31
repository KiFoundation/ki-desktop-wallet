<template>
<nav class="math-nav clearfix">
	<div class="float-right">
    <a href="https://mathwallet.org" class="mobile" target="_blank">
      <img src="static/img/icons/phone_blue@2x.png" height="16">
      <span>{{$t('webwallet_mobile_app')}}</span>
    </a>
    <div class="dropdown">
      <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button">{{$t("lang")}}<span class="tri"></span></a>
      <ul class="dropdown-menu">
        <li @click="changeLang('en')">English</li>
        <li @click="changeLang('cn')">中文</li>
        <li @click="changeLang('ko')">한국어</li>
      </ul>
    </div>
    <div class="dropdown">
      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="cUnit">{{unit}}</span> <span class="caret"></span></a>
      <ul class="dropdown-menu">
        <li @click="toggleUnit('USD')">USD</li>
        <li @click="toggleUnit('CNY')">CNY</li>
        <li @click="toggleUnit('KRW')">KRW</li>
      </ul>
    </div>
  </div>
  <a class="logo" href="https://mathwallet.org" target="_blank"><img src="static/img/icons/mathwallet_webwallet@2x.png" height="32"></a>
</nav>
</template>
<script>
import common from 'static/js/common.js'
export default {
  data() {
    return {
      unit:'USD'
    }
  },
  created(){
    this.unit=this.webCoin.getUnit();
  },
  methods:{
    changeLang(lang) {
      this.$i18n.setUserLanguage(lang);
    },
    toggleUnit(unit) {
      this.unit=this.webCoin.setUnit(unit);
      this.elementByValue();
    },
    elementByValue(){
      common.$emit('val', this.unit)
    }
  }
}
</script>
