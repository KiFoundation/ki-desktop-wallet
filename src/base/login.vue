<template>
<div class="login-container main-container">
  <!-- <img :src="'static/img/chain/'+blockchain_lowercase+'_banner.png'" width="100%"> -->
  <div class="info">
    <h1>{{blockchain}} <span>{{$t('webwallet_wallet')}}</span></h1>
    <p><span>{{$t('webwallet_home_create')}}</span></p>

    <div class="deck">
    <a role="button" data-toggle="modal" data-target="#import-form" class="custom-card">
      <div class="card" style="width: 15rem; display: inline-block">
          <img src="/static/img/chain/kichain_banner.png" class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">Import an existing Wallet</p>
        </div>
      </div>
    </a>

    <a role="button" data-toggle="modal" data-target="#add-form" class="custom-card">
      <div class="card" style="width: 15rem; display: inline-block">
          <img src="/static/img/chain/kichain_banner.png" class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">Generate a new Wallet</p>
          </div>
      </div>
    </a>
  </div>

<div class="modal fade" id="import-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Import Wallet</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="basic-form modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary">Import</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="add-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Generate a wallet</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>


    </div>
  </div>
</div>
</template>
<script>
export default {
  props: ['blockchain'],
  data() {
    return {
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: ''
    }
  },
  created() {

    this.getChain()

  },
  methods: {
    getChain() {
      if (this.blockchain) {
        let blockchain = this.blockchain.toLowerCase()
        this.blockchain_lowercase = blockchain
        this.nodeUrl = this.globalData[blockchain].nodeUrl
        this.network = this.globalData[blockchain].network
        this.token = this.globalData[blockchain].token
      }
    },

    login() {
      let nodeUrl = this.nodeUrl;
      let network = this.network;
      //
      // this.webUtil.initMathExtension().then((res) => {
      //   console.log(res);
      //   return mathExtension.getIdentity(network);
      // }).then((identity) => {
      //   console.log(JSON.stringify(identity));
      //   this.webUtil.setCookie("identity_" + this.blockchain_lowercase, JSON.stringify(identity), {
      //     expires: 30,
      //     path: '/'
      //   });
      //   this.$emit('sendAccount', identity)
      // }).catch(err => {
      //   alert(this.$t('noMathExtension'));
      // })
    }
  }
}
</script>
