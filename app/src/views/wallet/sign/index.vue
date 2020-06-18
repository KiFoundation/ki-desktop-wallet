<template>
  <div id="sign-form" class="d-flex w-100 h-100 flex-column px-3" style="background-color:white">
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
          <a class="inside" @click="removeFile()"
            ><img
              src="static/img/icons/delete.png"
              style="width:25px; opacity:0.2"
          /></a>
        </div>
      </li>
      <li class="token">
        <label style="margin-top: 10px;">{{ $t('webwallet_sign_summary') }}</label>
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
        <label style="margin-top: 10px;">{{ $t('webwallet_sign_signature') }}</label>
        <textarea v-model="sign.signature" class="" rows="3" disabled />
      </li>

    <div style="text-align:center">
      <a v-if="sign.signature == ''" class="btn  btn-primary" @click="signTxFile">{{
        $t('signtx')
      }}</a>
      <a v-else class="btn btn-download " @click="downloadSig">{{
        $t('download')
      }}</a>
    </div>

    </form>
    <form v-else>
      <!-- <div class="basic-form"> -->
        <div class="upload-form">
          <!-- <b-row align-v="center"> -->
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
          <!-- </b-row> -->
        </div>
      <!-- </div> -->
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { services } from '@services/index';
import { signTx, createBroadcastTx } from '@tendermint/sig';

export default {
  data() {
    return {
      denom: this.globalData.kichain.denom,
      password: 'password',
      wallet_pass_tmp: '',
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

  computed: {
    ...mapState({
      transactions: state => state.wallets.current.transactions,
      key: state => state.wallets.current.privatekey,
      account: state => state.account,
      wallet: state => state.wallets.current,
      chainId : state => state.app.chainId,
    }),
  },
  methods:{
    upload(e) {
      let file = e.dataTransfer.files[0];
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
              this.denom + '\nfrom:\t ' +
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
              this.denom + '\nto:\t\t\t ' +
              msg.value.validator_address
            );
            break;

          case 'cosmos-sdk/MsgUndelegate':
            var msg = msg_[0];
            return (
              'Unbond:\t ' +
              msg.value.amount.amount / Math.pow(10, 6) +
              this.denom + '\nfrom:\t ' +
              msg.value.validator_address
            );
            break;

          case 'cosmos-sdk/MsgBeginRedelegate':
            var msg = msg_[0];
            return (
              'Redelagate:\t ' +
              msg.value.amount.amount / Math.pow(10, 6) +
              this.denom + '\nfrom:\t\t ' +
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
    async signTxFile() {
      let transaction = JSON.parse(this.sign.file_content).value;
      let account =
        this.sign.onbehalf == '' ? this.account.id : this.sign.onbehalf;

      if (transaction.hasOwnProperty('signatures')) {
        delete transaction['signatures'];
      }

      const response = await services.auth.fetchAccount(account);

      let sequence_ = '';
      let account_number_ = '';

      if (response.data.result.value) {
        let res = '';
        if (response.data.result.type == 'cosmos-sdk/ContinuousVestingAccount') {
          res = response.data.result.value.BaseVestingAccount.BaseAccount;
        } else {
          res = response.data.result.value;
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

      const publickey = Buffer.from(this.wallet.publickey, 'hex');

      let signedTransactionme = signTx(transaction, signMeta, {
        privateKey: key,
        publicKey: publickey,
      });

      this.sign.signature = JSON.stringify(signedTransactionme.signatures[0]);
      this.wallet_pass_tmp=''
    },
    removeFile() {
        this.sign.file = '';
        this.sign.summary = '';
        this.sign.onbehalf = '';
        this.sign.signature = '';
        this.sign.file_valid = false;
        this.sign.file_content = '';
        this.wallet_pass_tmp=''
    },
  }
};
</script>

<style scoped></style>
