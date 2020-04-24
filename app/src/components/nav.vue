<template />
<script>
import common from "@static/js/common.js";
export default {
  data() {
    return {
      unit: "USD"
    };
  },
  created() {
    this.unit = this.webCoin.getUnit();
  },
  methods: {
    changeLang(lang) {
      this.$i18n.setUserLanguage(lang);
    },
    toggleUnit(unit) {
      this.unit = this.webCoin.setUnit(unit);
      this.elementByValue();
    },
    elementByValue() {
      common.$emit("val", this.unit);
    }
  }
};
</script>
