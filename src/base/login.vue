<template>
<div class="login-container main-container">
  <img :src="'static/img/chain/'+blockchain_lowercase+'_banner.jpg'" width="100%">
  <div class="info">
    <h1><span>{{$t('webwallet_your')}}</span> {{blockchain}} <span>{{$t('webwallet_wallet')}}</span></h1>
    <p><span>{{$t('webwallet_home_des1')}}</span> {{blockchain}} ({{token}} & Tokens) <span>{{$t('webwallet_home_des2')}}</span></p>
    <a @click="login" class="btn">{{$t('webwallet_login')}}</a>
  </div>
</div>
</template>
<script>
export default {
  props: ['blockchain'],
  data() {
    return {
      blockchain_lowercase:'',
      nodeUrl:'',
      network:'',
      token:''
    }
  },
  created() {

    this.getChain()

  },
  methods:{
    getChain(){
      if (this.blockchain) {
        let blockchain = this.blockchain.toLowerCase()
        this.blockchain_lowercase = blockchain
        this.nodeUrl = this.globalData[blockchain].nodeUrl
        this.network = this.globalData[blockchain].network
        this.token = this.globalData[blockchain].token
      }
    },
    login(){
      let nodeUrl = this.nodeUrl;
      let network = this.network;

      this.webUtil.initMathExtension().then((res) => {
        return mathExtension.getIdentity(network);
      }).then((identity) => {
        this.webUtil.setCookie("identity_"+this.blockchain_lowercase, JSON.stringify(identity), {
          expires: 30,
          path: '/'
        });
        this.$emit('sendAccount', identity)
      }).catch(err=>{
        alert(this.$t('noMathExtension'));
      })
    }
  }
}
</script>
