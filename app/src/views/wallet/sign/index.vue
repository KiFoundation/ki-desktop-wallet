<template>
  <div id="sign-form" class="transfer tab-pane">
    <form v-if="sign.file_valid" class="basic-form">
      <li class="token">
        <label>{{ $t('webwallet_signing_file_label') }}</label>
        <div class="buttonInside">
          <input
            type="text"
            style="margin:0"
            :value="sign.file.name"
            disabled
          />
          <a class="inside" @click="removeFile('sf', '')"
            ><img
              src="static/img/icons/delete.png"
              style="width:25px; opacity:0.2"
          /></a>
        </div>
      </li>
      <li class="token">
        <label>{{ $t('webwallet_sign_summary') }}</label>
        <textarea
          v-model="sign.summary"
          class="warning"
          rows="3"
          disabled
        />
      </li>
      <li class="token">
        <label>{{ $t('webwallet_sign_onbehalf') }}</label>
        <input
          v-model="sign.onbehalf"
          type="text"
          :placeholder="$t('webwallet_for_multisig')"
        />
      </li>
      <label>{{ $t('enter_password') }}</label>
      <div class="buttonInside">
        <input
          v-model="wallet_pass_tmp"
          :type="password"
          :class="[wallet_pass_tmp ? '' : sign.alert]"
        />
        <a
          v-if="password == 'password'"
          class="inside"
          @click="password = 'text'"
          ><img
            src="static/img/icons/eye-on.png"
            style="width:25px; opacity:0.2"
        /></a>

        <a
          v-if="password == 'text'"
          class="inside"
          @click="password = 'password'"
          ><img
            src="static/img/icons/eye-off.png"
            style="width:25px; opacity:0.2"
        /></a>
      </div>
      <li v-if="sign.signature != ''" class="token">
        <label>{{ $t('webwallet_sign_signature') }}</label>
        <textarea v-model="sign.signature" class="" rows="3" disabled />
      </li>

      <a v-if="sign.signature == ''" class="btn  btn-primary" @click="signTxFile">{{
        $t('signtx')
      }}</a>
      <a v-else class="btn btn-download " @click="downloadSig">{{
        $t('download')
      }}</a>
    </form>
    <form v-else>
      <div class="basic-form">
        <div class="upload-form">
          <b-row align-v="center">
            <b-col cols="4" />
            <b-col>
              <div
                v-cloak
                ref="myFile"
                class="upload-area"
                @drop.prevent="upload"
                @dragover.prevent
              >
                <p>
                  <img
                    src="static/img/icons/add.png"
                    style="width:100px; opacity:0.2;margin-bottom:20px"
                  />
                </p>
                <span style="opacity:0.3">{{
                  $t('webwallet_drag_drop')
                }}</span>
              </div>
            </b-col>
            <b-col cols="4" />
          </b-row>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// import {  BPagination } from 'bootstrap-vue';

export default {
  data() {
    return {
      nodeUrl: '',
      network: '',
      token: '',
      blockchain: 'KiChain',
      prefix: '',
      account: '',
      password: 'password',
      wallet_pass_tmp: '',
      gradient_style: 'background-image: linear-gradient(90deg,#1848E0,#05268E);',
      isLoading: true,
      sign: {
        alert: '',
        file: '',
        file_valid: false,
        file_content: '',
        summary: '',
        signature: '',
        onbehalf: '',
      },
    }
  },

  components: {
    // BPagination,
  },
  computed: {
    ...mapState({
      transactions: state => state.wallets.current.transactions,
    }),
  },
  methods:{
    upload(e) {
      let file = e.dataTransfer.files[0];

      if (!this.multisig) {
        this.sign.file = file;
        if (!file) return;

        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = evt => {
          this.sign.file_content = evt.target.result;
          this.sign.file_valid = true;
          this.sign.summary = this.parseMessage(this.sign.file_content);
        };
        reader.onerror = evt => {
          console.error(evt);
        };
      } else {
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
      }
    },
    parseMessage(file) {
      try {
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
      let sig = sig_data.pub_key.signature;

      this.multisign.signed[name] = pubkey;

      this.multisign.pubkeys.forEach(
        key => (key.status = key.address == pubkey ? 'signed' : key.status),
      );
    },
    downloadSig() {
      let filename = 'signed_tx.json';
      let href =
        'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this.sign.signature);

      var element = document.createElement('a');
      element.setAttribute('href', href);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    signTxFile() {
      let nodeUrl = this.globalData.kichain.nodeUrl;
      let transaction = JSON.parse(this.sign.file_content).value;
      let account =
        this.sign.onbehalf == '' ? this.account : this.sign.onbehalf;

      if (transaction.hasOwnProperty('signatures')) {
        delete transaction['signatures'];
      }

      axios.get(nodeUrl + '/auth/accounts/' + account).then(res1 => {
        let sequence_ = '';
        let account_number_ = '';

        if (res1.data.result.value) {
          let res = '';
          if (res1.data.result.type == 'cosmos-sdk/ContinuousVestingAccount') {
            res = res1.data.result.value.BaseVestingAccount.BaseAccount;
          } else {
            res = res1.data.result.value;
          }
          sequence_ = res.sequence;
          account_number_ = res.account_number;
        }

        const signMeta = {
          chain_id: this.chainId,
          account_number: account_number_.toString(),
          sequence: sequence_.toString(),
        };

        var CryptoJS = require('crypto-js');
        var bytes = CryptoJS.AES.decrypt(this.key, this.wallet_pass_tmp);
        let key = Buffer.from(bytes.toString(CryptoJS.enc.Utf8), 'hex');

        const publickey = Buffer.from(this.publickey, 'hex');

        let signedTransactionme = signTx(transaction, signMeta, {
          privateKey: key,
          publicKey: publickey,
        });

        this.sign.signature = JSON.stringify(signedTransactionme.signatures[0]);
      });
    },

    removeFile(list, file) {
      if (list == 'sf') {
        this.sign.file = '';
        this.sign.summary = '';
        this.sign.onbehalf = '';
        this.sign.signature = '';
        this.sign.file_valid = false;
        this.sign.file_content = '';
      }

      if (list == 'msf') {
        this.multisign.file = '';
        this.multisign.signed = '';
        this.multisign.summary = '';
        this.multisign.sigfiles = [];
        this.multisign.signature = '';
        this.multisign.file_valid = false;
        this.multisign.file_content = '';
        this.multisign.pubkeys.forEach(key => (key.status = 'signed'));
      }

      if (list == 'mssf') {
        this.multisign.sigfiles = this.multisign.sigfiles.filter(f => {
          // console.log(this.multisign.signed[file.name])
          // console.log(this.multisign.signed)

          this.multisign.pubkeys.forEach(
            key =>
              (key.status =
                key.address == this.multisign.signed[file.name]
                  ? 'pending...'
                  : key.status),
          );
          return f != file;
        });
      }
    },
  }
};
</script>

<style scoped></style>
