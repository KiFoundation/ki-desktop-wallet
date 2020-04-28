import Vue from 'vue';
import Vuex from 'vuex';

import { moduleWallets } from './wallets';
import { moduleValidators } from './validators';
import { moduleApp } from './app';
import { moduleAccount } from './account';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    wallets: moduleWallets,
    validators: moduleValidators,
    app: moduleApp,
    account: moduleAccount,
  },
});
