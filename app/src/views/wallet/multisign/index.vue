<template>
  <div id="msign-form" class="transfer tab-pane">
            <form v-if="multisign.file_valid">
              <div class="basic-form">
                <li class="token">
                  <label>{{$t("webwallet_signing_file_label")}}</label>
                  <div class="buttonInside">
                    <input type="text" style="margin:0" :value="this.multisign.file.name" disabled />
                    <a class="inside" @click="removeFile('msf', '')"><img src="static/img/icons/delete.png" style="width:25px; opacity:0.2" /></a>
                  </div>
                </li>
                <li class="token">
                  <label style="margin-top: 10px;">{{$t("webwallet_sign_summary")}}</label>
                  <textarea class="warning" v-model="this.multisign.summary" rows="3" disabled />
                </li>
                <!-- <li class="token">
                <label>{{$t("webwallet_sign_onbehalf")}}</label>
                <input type="text" :placeholder="$t('webwallet_for_multisig')">
              </li> -->

                <div class="upload-form" style="margin-top:10px; width:90%;">
                  <b-row>
                    <b-col cols="3">
                      <div v-cloak @drop.prevent="upload" @dragover.prevent class="upload-area" ref="myFile">
                        <p> <img src="static/img/icons/add.png" style="width:70px; opacity:0.2;margin-bottom:20px" /></p>
                        <span style="opacity:0.3">{{$t('webwallet_drag_drop_sigs')}}</span>
                      </div>
                    </b-col>
                    <b-col cols="3" style="max-height:240px">
                      <div class="wallet-list" style="max-height:100%">

                      <li class="token" v-for="(item, index) in multisign.sigfiles" v-bind:key="index">
                        <!-- <label>{{$t("webwallet_signing_file_label")}}</label> -->
                        <div class="buttonInside">
                          <input type="text" style="margin:0" :value="item.name" disabled />
                          <a class="inside" @click="removeFile('mssf', item)"><img src="static/img/icons/delete.png" style="width:25px; opacity:0.2" /></a>
                        </div>
                      </li>
                    </div>
                    </b-col>

                    <b-col cols="6" style="max-height:240px">
                      <div class="wallet-list" style="max-height:100%">
                        <b-table style="font-size:11px; text-align: left;" sticky-header no-border-collapse hover borderless ref="selectableTable" select-mode="single" :items="pubkeys" :fields="multisign.fields" head-variant="null"
                          responsive="sm">
                          <template v-slot:table-caption>{{description}}</template>
                        </b-table>
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <li v-if="this.multisign.signature!=''" class="token">
                  <label style="margin-top: 10px;">{{$t("webwallet_sign_signature")}}</label>
                  <textarea class="" v-model="this.multisign.signature" rows="3" disabled />
                </li>
                <div v-if="this.multisign.signature==''">
                  <a class="btn  btn-primary" @click="msignTxFile">{{$t("signtx")}}</a>
                </div>
                <div v-else>
                  <a class="btn btn-download " @click="downloadSig">{{$t("download")}}</a>
                  <a class="btn btn-success " @click="broadcastTx">{{$t("broadcast")}}</a>
                </div>
              </div>
            </form>
            <form v-else>
              <!-- <div class="basic-form"> -->
                <div class="upload-form">
                  <!-- <b-row align-v="center"> -->
                    <b-col cols="4"/>
                    <b-col>
                      <div v-cloak @drop.prevent="upload" @dragover.prevent class="upload-area" ref="myFile">
                        <p> <img src="static/img/icons/add.png" style="width:100px; opacity:0.2;margin-bottom:20px" /></p>
                        <span style="opacity:0.3">{{$t('webwallet_drag_drop')}}</span>
                      </div>
                    </b-col>
                    <b-col cols="4" />
                  <!-- </b-row> -->
                </div>
              <!-- </div> -->
            </form>
          </div>
</template>

<script>
import Vue from 'vue'
import { services } from '@services/index';
import { mapActions, mapState } from 'vuex';
import { BTable } from 'bootstrap-vue';
import { createBroadcastTx } from '@tendermint/sig';
Vue.component('b-table', BTable);

export default {
  data() {
    return {
      password: 'password',
      wallet_pass_tmp: '',
      isLoading: true,
      multisign: {
        'alert': '',
        'file': '',
        'file_valid': false,
        'file_content': '',
        'summary': '',
        'signature': '',
        'signature_obj': '',
        'sigfiles': [],
        'txfile_valid': false,
        'fields': ['address', 'status'],
        'signed': {},
      }
    }
  },

  components: {
    // BPagination,
  },
  computed: {
    ...mapState({
      transactions: state => state.wallets.current.transactions,
      pubkeys: state => state.wallets.current.multisign_data.signerList,
      threshold: state => state.wallets.current.multisign_data.threshold,
      description: state => state.wallets.current.multisign_data.description,
    }),
  },
  methods:{
    upload(e) {
      let file = e.dataTransfer.files[0];

        if (this.multisign.file_content == '') {
          this.multisign.file = file;
          if (!file) return;

          let reader = new FileReader();
          reader.readAsText(file, 'UTF-8');
          reader.onload = evt => {
            this.multisign.file_content = evt.target.result;
            this.multisign.file_valid = true;
            this.multisign.summary = this.parseMessage(
              this.multisign.file_content,
            );
          };
          reader.onerror = evt => {
            console.error(evt);
          };
        } else {
          this.multisign.sigfiles.push(file);
          if (!file) return;
          let reader = new FileReader();
          reader.readAsText(file, 'UTF-8');
          reader.onload = evt => {
            this.parseSignature(file.name, evt.target.result);
          };
          reader.onerror = evt => {
            console.error(evt);
          };
        }
    },
    parseMessage(file) {
      try {
        this.multisign.signature_obj=JSON.parse(file).value
        let msg_ = JSON.parse(file).value.msg;

        switch (msg_[0].type) {
          case 'cosmos-sdk/MsgSend':
            var msg = msg_[0];
            return (
              'Send:\t ' +
              msg.value.amount[0].amount / Math.pow(10, 6) +
              ' tki \nfrom:\t ' +
              msg.value.from_address +
              ' \nto:\t\t ' +
              msg.value.to_address
            );
            break;

          case 'cosmos-sdk/MsgDelegate':
            var msg = msg_[0];
            return (
              'Delegate:\t ' +
              msg.value.amount.amount / Math.pow(10, 6) +
              ' tki \nto:\t\t\t ' +
              msg.value.validator_address
            );
            break;

          case 'cosmos-sdk/MsgUndelegate':
            var msg = msg_[0];
            return (
              'Unbond:\t ' +
              msg.value.amount.amount / Math.pow(10, 6) +
              ' tki \nfrom:\t ' +
              msg.value.validator_address
            );
            break;

          case 'cosmos-sdk/MsgBeginRedelegate':
            var msg = msg_[0];
            return (
              'Redelagate:\t ' +
              msg.value.amount.amount / Math.pow(10, 6) +
              ' tki \nfrom:\t\t ' +
              msg.value.validator_src_address +
              ' \nto:\t\t\t ' +
              msg.value.validator_dst_address
            );
            break;

          case 'cosmos-sdk/MsgWithdrawDelegationReward':
            var msg = msg_[0];
            var output = 'Withdraw rewards ';
            if (!(msg_[1] === undefined)) {
              if (msg_[1].type == 'cosmos-sdk/MsgWithdrawValidatorCommission') {
                output = 'Withdraw rewards and commissions ';
              }
            }
            output = output + 'from ' + msg.value.validator_address;
            return output;
            break;

          case 'cosmos-sdk/MsgWithdrawValidatorCommission':
            var msg = msg_[0];
            var output = 'Withdraw commissions';
            if (!(msg_[1] === undefined)) {
              if (msg_[1].type == 'cosmos-sdk/MsgWithdrawValidatorCommission') {
                output = 'Withdraw rewards and commissions ';
              }
            }
            output = output + 'from ' + msg.value.validator_address;
            return output;
            break;

          default:
            return 'The file does not seem to contain a valid transaction structure.';
        }
      } catch (error) {
        return 'The file does not seem to contain a valid transaction structure.';
      }
    },
    parseSignature(name, file) {
      let sig_data = JSON.parse(file);
      let pubkey = sig_data.pub_key.value;
      let sig = sig_data.signature;
      this.multisign.signed[name] = [pubkey, sig];

      this.pubkeys.forEach(
        key => (key.status = key.address == pubkey ? 'signed' : key.status),
      );
    },
    downloadSig() {
      let filename = 'signed_tx.json';
      let href =
        'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this.multisign.signature);

      var element = document.createElement('a');
      element.setAttribute('href', href);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    msignTxFile() {
      var bsigs= []
      var prefix_signer_byte = 0

      for (var sig in this.multisign.signed){
        let tmp = this.multisign.signed[sig][0]

        // compute the signer order prefix byte
        var index = this.pubkeys.findIndex(function(signer) {
          return signer.address == tmp
        })

        prefix_signer_byte += Math.pow(2, 7-index)

        // encode each signature (base 64)
        var binary_string = window.atob(this.multisign.signed[sig][1]);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        var b = []
        for (var i = 0; i < len; i++) {
           b[i] = binary_string.charCodeAt(i);
         }
         bsigs[index] = b
      }

      // create the signature prefixes
      var prefix_struct = [10, 5, 8, 3, 18, 1]
      var prefix_signer = [prefix_signer_byte]
      var prefix_separator = [18, 64]
      var prefix =[]
      prefix = prefix.concat(prefix_struct)
      prefix = prefix.concat(prefix_signer)

      var sig = []

      // Concatenate the signatures and separate them with the separator
      sig = sig.concat(prefix)
      for (var bsig in bsigs){
        sig = sig.concat(prefix_separator)
        sig = sig.concat(bsigs[bsig])
      }

      var buffer = Buffer.from(sig);
      var binary = '';

      var bytes = new Uint8Array( buffer );

      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }

      // TODO : get this from state
      var pub_key_elements = []
      this.pubkeys.forEach(key =>  {
        pub_key_elements.push({'type': 'tendermint/PubKeySecp256k1', 'value': key.address})
      })

      var pub_key_final = {"type": "tendermint/PubKeyMultisigThreshold",
      "value": {'threshold': this.threshold, 'pubkeys': pub_key_elements}}

      this.multisign.signature_obj['signatures'] = [{ 'pub_key': pub_key_final, 'signature': window.btoa( binary ) } ];
      this.multisign.signature = JSON.stringify(this.multisign.signature_obj);
    },

    removeFile(list, file) {
      if (list == 'msf') {
        this.multisign.file = '';
        this.multisign.signed = {};
        this.multisign.summary = '';
        this.multisign.sigfiles = [];
        this.multisign.signature = '';
        this.multisign.file_valid = false;
        this.multisign.file_content = '';
        this.pubkeys.forEach(key => (key.status = 'pending...'));
        this.multisign.signed=[];
      }

      if (list == 'mssf') {
        this.multisign.sigfiles = this.multisign.sigfiles.filter(f => {
          this.pubkeys.forEach(
            key =>
              (key.status =
                key.address == this.multisign.signed[file.name][0]
                  ? 'pending...'
                  : key.status),
          );
          return f != file;
        });
      }
    },

    async broadcastTx(){
      const bcTransactionme = createBroadcastTx(this.multisign.signature_obj);
      console.log(JSON.stringify(bcTransactionme))
      try {
        const responsePostTransfer = await services.tx.postTx(bcTransactionme);
        this.$bvToast.toast('Transaction sent with success', {
          variant: 'success',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true,
          toaster: 'b-toaster-bottom-center',
        });
        removeFile('msf', '')
        // this.$emit('onWithdrawSuccess');
      } catch (error) {

        this.$bvToast.toast("Failed to send", {
          variant: 'danger',
          autoHideDelay: 2000,
          solid: true,
          noCloseButton: true,
          toaster: 'b-toaster-bottom-center',
        });
        // this.$emit('onWithdrawError');
      }
    }
  }
};
</script>

<style scoped></style>
