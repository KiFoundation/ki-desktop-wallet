<template>
  <b-row v-if="validator" class="validator-card align-items-center mx-0">
    <b-col>
      <b-row class="w-100 align-items-center">
        <b-col cols="3" class="flex-row d-flex align-items-center">
          <div :style="{ position: 'relative' }">
            <b-avatar
              class="d-flex justify-content-center align-items-center"
              size="2rem"
              :variant="avatarRandomVariant"
              :text="
                validator.description.moniker
                  .toUpperCase()
                  .match(new RegExp(/[A-Za-z]/))[0]
              "
              :style="{ backgroundImage: avatarGradient, color: 'white' }"
            />
          </div>
          <h6 class="ml-4">
            {{ validator.description.moniker }}

          </h6>
        </b-col>

        <b-col cols="1">
          <b-badge v-if="validators_dict[validator.operator_address].status=='unbonded' || validators_dict[validator.operator_address].status=='unbonding'"  >
            Jailed
          </b-badge>
        </b-col>

        <b-col cols="4">
          <span v-if="!reward"
            :style="{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }"
          >
            {{
              currentWallet.delegation.find(
                d => d.validator_address === validator.operator_address,
              ) &&
                formatAmount(
                  currentWallet.delegation.find(
                    d => d.validator_address === validator.operator_address,
                  ).shares,
                ) + ' / '
            }}
            {{ formatAmount(validator.delegator_shares) }}
          </span>
          <span v-else
            :style="{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }"
          >
          {{reward}} {{ globalData.kichain.token }}

          </span>
        </b-col>
        <b-col cols="4" class="d-flex justify-content-end">
          <slot />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol, BAvatar, BButton, BBadge } from 'bootstrap-vue';
import * as numeral from 'numeral';
import { mapState } from 'vuex';
import { tokenUtil } from '@static/js/token';
import util from '@static/js/util';

export default {
  components: {
    BRow,
    BCol,
    BAvatar,
    BBadge
  },
  props: {
    validator: {
      type: Object,
      default: null,
    },
    reward: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapState({
      currentWallet: state => state.wallets.current,
      validators_dict: state => state.validators.dict,
    }),
    avatarRandomVariant() {
      const variants = [
        'secondary',
        'primary',
        'dark',
        'light',
        'success',
        'danger',
        'warning',
        'info',
      ];
      return variants[Math.floor(Math.random() * variants.length)];
    },
    avatarGradient() {
      return util.generateWalletGradient(this.validator.operator_address);
    },
  },
  methods: {
    onSelectValidator() {
      this.$emit('onSelectValidator', this.validator);
    },
    formatAmount(amount) {
      if ( amount > 1 ){
        return tokenUtil.format(amount);
      }
      else{
        return 0
      }
    },
  },
};
</script>

<style scoped>
.validator-card {
  /* cursor: pointer; */
  width: 100%;
  color: black;
  /* min-height: 50px; */
  min-height: 50px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 240ms, transform 200ms;
}
.validator-card:hover {
  box-shadow: 0px 3px 3px rgba(154, 160, 185, 0.04);
}
.link {
  color: var(--primary);
  font-weight: 600;
}
.link:hover {
  color: var(--primary);
  text-decoration: underline;
}
</style>
