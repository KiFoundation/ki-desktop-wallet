<template>
<div id="msign-form" class="d-flex w-100 h-100 flex-column px-3" style="background-color:white;overflow-x: hidden;">
  <form v-if="multisign.file_valid" class="basic-form modal-body" style="padding-top:40px">
    <b-row>
      <b-col cols="6">
        <b-row style="margin-bottom:10px;">
          <b-col cols="10">
            <h6>{{ $t('webwallet_signing_file_label') }}</h6>
          </b-col>
          <b-col />
        </b-row>
        <b-row style="margin-bottom:15px;">
          <b-col cols="12">
            <div class="buttonInside">
              <input type="text" style="margin:0" :value="this.multisign.file.name" disabled />
              <a class="inside" @click="removeFile('msf', '')">
                <img src="static/img/icons/delete.png" style="width:25px; opacity:0.2" />
              </a>
            </div>
          </b-col>
        </b-row>
        <b-row style="margin-bottom:10px;">
          <b-col cols="10">
            <h6>{{$t("webwallet_sign_summary")}}</h6>
          </b-col>
          <b-col />
        </b-row>
        <b-row style="margin-bottom:10px;">
          <b-col cols="12">
            <textarea style="font-size:14px" v-model="this.multisign.summary" rows="3" disabled />
          </b-col>
        </b-row>
        <b-row align-v="center" style="margin-bottom:25px;">
          <b-col style="text-align:end">
            <a class="stealth-link" @click="changeSignMode">
              <span v-if="!signRawData">Sign raw data file</span>
              <span v-else>Sign transaction file</span>
            </a>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="6">
        <b-row style="margin-bottom:10px;">
          <b-col cols="10">
            <h6>{{$t("webwallet_sign_participants")}}</h6>
          </b-col>
          <b-col />
        </b-row>
        <b-row style="margin-bottom:20px;">
          <b-col cols="12" style="max-height:120px">
            <div class="wallet-list" style="max-height:100%">
              <b-table style="font-size:11px; text-align: left;margin-bottom: 0px" sticky-header no-border-collapse hover borderless ref="selectableTable" select-mode="single" :items="pubkeys" :fields="multisign.fields" head-variant="null"
                responsive="sm" thead-class="hidden_header">
                <!-- <template v-slot:table-caption>{{description}}</template> -->
              </b-table>
            </div>
          </b-col>
        </b-row>

        <b-row style="margin-bottom:10px;">
          <b-col cols="4">
            <h6>{{$t("webwallet_sign_threshold")}}
            </h6>
          </b-col>
          <b-col cols="8" class="caption">
            <span >{{description}}</span>
          </b-col>
        </b-row>
        <b-row align-v="end" >
          <b-col>
            <b-progress :max="pubkeys.length" height="25px">
              <b-progress-bar :value="multisign.progress" style="background-color:var(--primary)"/>
              <b-progress-bar :value="threshold - multisign.progress" style="background-color:var(--secondary)"/>
            </b-progress>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row style="margin-bottom:25px;">
      <b-col cols="6">
        <b-row style="margin-bottom:10px;">
          <b-col cols="10">
            <h6>{{$t("webwallet_sign_participants_sig")}}</h6>
          </b-col>
          <b-col />
        </b-row>
        <b-row>
          <b-col cols="6">
            <div style="text-align: center; height:180px" v-cloak @drop.prevent="upload" @dragover.prevent class="upload-area" ref="myFile" >
              <p > <img src="static/img/icons/add.png" style="width:70px; opacity:0.2;margin-bottom:20px" /></p>
              <span style="opacity:0.3">{{$t('webwallet_drag_drop_sigs')}}</span>
            </div>
          </b-col>
          <b-col cols="6" style="max-height:180px">
            <div class="wallet-list" style="max-height:100%; margin-bottom:0">

            <li class="token" v-for="(item, index) in multisign.sigfiles" v-bind:key="index">
              <!-- <label>{{$t("webwallet_signing_file_label")}}</label> -->
              <div class="buttonInside">
                <input type="text" style="margin:0; font-size:11px" :value="item.name" disabled />
                <a  v-if="multisign.signature==''" class="inside" @click="removeFile('mssf', item);getProgress()"><img src="static/img/icons/delete.png" style="width:25px; opacity:0.2" /></a>
              </div>
            </li>
          </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="6">
        <b-row style="margin-bottom:10px;">
          <b-col>
          <div v-if="this.multisign.signature!=''" class="token">
            <b-row style="margin-bottom:10px;">
              <b-col cols="10">
                <h6>{{$t("webwallet_sign_signature")}}</h6>
              </b-col>
              <b-col />
            </b-row>
            <b-row style="margin-bottom:10px;">
              <b-col cols="12">
                <textarea class="" v-model="this.multisign.signature" rows="5" disabled />
                </b-col>
            </b-row>
          </div>
        </b-col>

        </b-row>

        <b-row style="margin-bottom:10px;">
          <b-col>
            <b-row v-if="this.multisign.signature=='' && multisign.txfile_valid && multisign.progress >= threshold ">
              <b-col style="text-align: end;">
                <a class="btn btn-primary mt-1" @click="msignTx">{{$t("signtx")}}</a>
              </b-col>
            </b-row>

            <b-row v-if="this.multisign.signature!=''">
              <b-col style="text-align: end;">
                <a class="btn btn-download mt-1" @click="downloadSig">{{$t("download")}}</a>
                <a class="btn btn-primary mt-1" @click="broadcastTx">{{$t("broadcast")}}</a>
              </b-col>
            </b-row>
        </b-col>

        </b-row>
      </b-col>
    </b-row>

    </form>
    <form v-else>
        <div class="upload-form" >
          <b-row align-v="center">
            <b-col cols="4"/>
            <b-col>
              <div v-cloak @drop.prevent="upload" @dragover.prevent class="upload-area" ref="myFile" >
                <p> <img src="static/img/icons/add.png" style="width:100px; opacity:0.2;margin-bottom:20px" /></p>
                <span style="opacity:0.3">{{$t('webwallet_drag_drop')}}</span>
              </div>
            </b-col>
            <b-col cols="4" />
          </b-row>
        </div>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  services
} from '@services/index';
import {
  mapActions,
  mapState
} from 'vuex';
import {
  BTable,
  BRow,
  BCol,
  BProgress,
  BProgressBar
} from 'bootstrap-vue';
import {
  makeMultisignedTx,
  StargateClient
} from '@cosmjs/stargate'
import {
  TxRaw
} from "cosmjs-types/cosmos/tx/v1beta1/tx";


export default {
  data() {
    return {
      denom: this.globalData.kichain.denom,
      password: 'password',
      wallet_pass_tmp: '',
      isLoading: true,
      signRawData: false,
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
        'progress': 0,
      }
    }
  },

  components: {
    BTable,
    BRow,
    BCol,
    BProgress,
    BProgressBar
  },
  computed: {
    ...mapState({
      transactions: state => state.wallets.current.transactions,
      pubkeys: state => state.wallets.current.multisign_data.signerList,
      threshold: state => state.wallets.current.multisign_data.threshold,
      description: state => state.wallets.current.multisign_data.description,
    }),
  },
  methods: {
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
        if (!file) return;
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = evt => {
          this.parseSignature(file.name, evt.target.result);
          this.multisign.sigfiles.push(file);
          this.getProgress();
        };
        reader.onerror = evt => {
          console.error(evt);
        };
      }
    },
    changeSignMode(){
      this.signRawData = !this.signRawData
      this.multisign.summary = this.parseMessage(this.multisign.file_content);
    },
    parseMessage(file) {
      if (!this.signRawData) {

        try {
          this.multisign.signature_obj = JSON.parse(file).value
          let msg_ = JSON.parse(file).value.msg;

          switch (msg_[0].type) {
            case 'cosmos-sdk/MsgSend':
              var msg = msg_[0];
              this.multisign.txfile_valid = true
              return (
                'Send: ' +
                msg.value.amount[0].amount / Math.pow(10, 6) +
                this.denom + '\nfrom: ' +
                msg.value.from_address +
                ' \nto: ' +
                msg.value.to_address
              );
              break;

            case 'cosmos-sdk/MsgDelegate':
              var msg = msg_[0];
              this.multisign.txfile_valid = true
              return (
                'Delegate: ' +
                msg.value.amount.amount / Math.pow(10, 6) +
                this.denom + '\nfrom: ' +
                msg.value.delegator_address +
                '\nto: ' +
                msg.value.validator_address
              );
              break;

            case 'cosmos-sdk/MsgUndelegate':
              var msg = msg_[0];
              this.multisign.txfile_valid = true
              return (
                'Unbond: ' +
                msg.value.amount.amount / Math.pow(10, 6) +
                this.denom + '\nfrom: ' +
                msg.value.validator_address
              );
              break;

            case 'cosmos-sdk/MsgBeginRedelegate':
              var msg = msg_[0];
              this.multisign.txfile_valid = true
              return (
                'Redelegate: ' +
                msg.value.amount.amount / Math.pow(10, 6) +
                this.denom + '\nfrom: ' +
                msg.value.validator_src_address +
                ' \nto: ' +
                msg.value.validator_dst_address
              );
              break;

            case 'cosmos-sdk/MsgWithdrawDelegationReward':
              var msg = msg_[0];
              var output = 'Withdraw rewards ';
              this.multisign.txfile_valid = true
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
              this.multisign.txfile_valid = true
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
      } else {
          this.multisign.txfile_valid = true
          return file
        }
    },
    parseSignature(name, file) {
      let sig_data = JSON.parse(file);
      try{
        let pubkey = sig_data.pubKey.value;
        let sig = sig_data.signature;
        let bechAddress = sig_data.address;
        let txBody = Buffer.from(sig_data.transaction, 'base64')
        let signingInstruction = sig_data.signingInstruction;

        this.multisign.signed[name] = {pubkey: pubkey, signature: sig, address: bechAddress, txBody: txBody, signingInstruction: signingInstruction};
        this.pubkeys.forEach( function(key){
            if (key.address == pubkey) {
              if (key.status == 'signed'){
                throw new Error("Signature already exists")
              }else{
                key.status = 'signed'
              }
            }
        });
      }
      catch(error){
        let humanizedError;
        if (RegExp(`^TypeError: Cannot read property 'value'`).test(error)) {
          humanizedError = 'Not a signature file';
        }
        if (RegExp(`^Error: Signature already exists`).test(error)) {
          humanizedError = 'Signature already exists';
        }
        this.$bvToast.toast(humanizedError, {
          variant: 'danger',
          autoHideDelay: 2000,
          solid: true,
          noCloseButton: true,
          toaster: 'b-toaster-bottom-center',
        });
        throw new Error(humanizedError);
      }
    },
    getProgress(){
      this.multisign.progress =  Object.keys(this.multisign.signed).length
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

    async msignTx(){
      let signatures = []
      for (var sig in this.multisign.signed) {
        signatures.push([this.multisign.signed[sig].address, Buffer.from(Object.values(this.multisign.signed[sig].signature))])
      }

      const bodyBytes = Buffer.from(Object.values(this.multisign.signed[sig].txBody))
      const signingInstruction = this.multisign.signed[sig].signingInstruction

      var pub_key_elements = []
      this.pubkeys.forEach(key => {
        pub_key_elements.push({
          'type': 'tendermint/PubKeySecp256k1',
          'value': key.address
        })
      })

      var pub_key_final = {
        type: "tendermint/PubKeyMultisigThreshold",
        value: {
          threshold: this.threshold,
          pubkeys: pub_key_elements
        }
      }

      var a = new Map(signatures)

      const signedTx = makeMultisignedTx(
        pub_key_final,
        signingInstruction.sequence,
        signingInstruction.fee,
        bodyBytes,
        new Map(signatures),
      );

      this.multisign.signature = JSON.stringify(signedTx);

      var b64encoded = btoa(String.fromCharCode.apply(null, Uint8Array.from(TxRaw.encode(signedTx).finish())));
      this.multisign.signature_obj = b64encoded
    },
    removeFile(list, file) {
      if (list == 'msf') {
        this.multisign.file = '';
        this.multisign.signed = {};
        this.multisign.summary = '';
        this.multisign.sigfiles = [];
        this.multisign.signature = '';
        this.multisign.file_valid = false;
        this.multisign.txfile_valid = false;
        this.multisign.file_content = '';
        this.multisign.progress = 0;
        this.pubkeys.forEach(key => (key.status = 'pending...'));
      }

      if (list == 'mssf') {
        this.multisign.sigfiles = this.multisign.sigfiles.filter(f => {
          try{
            this.pubkeys.forEach(
            key =>
            (key.status =
              key.address == this.multisign.signed[file.name][0] ?
              'pending...' :
              key.status),
          );
          delete this.multisign.signed[file.name];
        }catch(error)
        {
          console.log("Not a signature file")
        }
          return f != file;
        });
      }
    },

    async broadcastTx() {
      const bcTransactionme = {
              "tx_bytes": this.multisign.signature_obj,
              "mode": "BROADCAST_MODE_SYNC"
            }

      var success = false
      try {
        const responsePostTransfer = await services.tx.postMsTx(bcTransactionme);

        if (responsePostTransfer.data.tx_response.code != 0){
          throw new TypeError(responsePostTransfer.data.tx_response.raw_log)
        }

        this.$bvToast.toast('Transaction sent with success', {
          variant: 'success',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true,
          toaster: 'b-toaster-bottom-center',
        });
        success = true;
        // this.$emit('onTransferSuccess');
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: `Transaction failed`,
          variant: 'danger',
          autoHideDelay: 2000,
          solid: true,
          noCloseButton: true,
          toaster: 'b-toaster-bottom-center',
        });
        // this.$emit('onTransferError');
      }
      if (success) {
        this.removeFile('msf', '')
      }
    }
  }
};
</script>

<style >
.caption{
    font-size: 10px;
    color: #6c757d;
    text-align: right;
  }
</style>
