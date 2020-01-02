<template>
<nav class="math-nav clearfix">
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
