<template>
  <!-- ========================Withdraw form============================ -->
  <div id="withdraw-form w-100" class="transfer tab-pane">
    <form v-if="Object.keys(this.delegations).length > 0" class="basic-form">
      <li class="token">
        <label>{{ $t('webwallet_from_validator') }}</label>

        <input
          v-model="withdraw.validator_address"
          type="text"
          :placeholder="$t('webwallet_to_validator_pl')"
          :class="[withdraw.validator_address ? '' : withdraw.alert]"
          list="validator_withdraw_list"
        />
        <datalist id="validator_withdraw_list">
          <option
            v-for="(item, index) in delegations"
            :key="index"
            :value="index"
          >
            {{ item[0] }}
          </option>
        </datalist>
      </li>
      <ul>
        <li>
          <!-- <label for="checkbox">{{$t("withdraw_with_commission")}}</label>
                <input type="checkbox" id="checkbox" > -->
          <label>{{ $t('withdraw_config') }}</label>
          <select v-model="withdraw.config">
            <option key="0" value="0">
              Rewards only
            </option>
            <option key="1" value="1">
              Commisions only
            </option>
            <option key="2" value="2">
              Rewards and commissions
            </option>
          </select>
          <span
            v-if="withdraw.config == 1 || withdraw.config == 2"
            class="local-alert"
            >{{ $t('withdraw_with_commission_alert') }}</span
          >
        </li>
      </ul>
      <label>{{ $t('enter_password') }}</label>
      <div class="buttonInside">
        <input
          v-model="wallet_pass_tmp"
          :type="password"
          :class="[wallet_pass_tmp ? '' : withdraw.alert]"
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
      <li v-if="withdraw.output != ''" class="token">
        <label>{{ $t('webwallet_output') }}</label>
        <textarea v-model="withdraw.output" class="" rows="3" disabled />
      </li>

      <b-row align-v="center">
        <b-col>
          <a class="btn" @click="sendWithdrawTx">
            <span v-if="context == 'Broadcast' || (!advanced && !multisig)">{{
              $t('withdrawtx')
            }}</span>
            <span v-else>{{ context }}</span></a
          >
        </b-col>
        <b-col v-if="advanced" cols="2">
          <select v-model="context" style="margin-top:32px">
            <option key="Broadcast" value="Broadcast" selected>
              Broadcast
            </option>
            <option key="Sign" value="Sign">
              Sign
            </option>
            <option key="Generate" value="Generate">
              Generate
            </option>
          </select>
        </b-col>
      </b-row>
    </form>
    <form v-else>
      <div
        class="d-flex align-items-center w-100 h-100 text-center justify-content-center"
      >
        <div>
          <p style="font-size:60px">
            🤔
          </p>
          {{ $t('webwallet_no_delegations') }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue';

export default {
  components: {
    BRow,
    BCol,
  },
  props: {
    advanced: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      multisig: false,
      context: 'Broadcast',
      password: 'password',
      wallet_pass_tmp: '',
      withdraw: {
        alert: '',
        validator_address: '',
        config: 0,
        output: '',
      },
      delegations: [],
    };
  },
  methods: {
    sendWithdrawTx() {},
  },
};
</script>

<style scoped></style>
