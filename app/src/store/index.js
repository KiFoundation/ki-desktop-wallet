import Vue from 'vue';
import { services } from '@services/index';
/* 
function getWallets() {
  const wallets = [];
  console.log(localStorage.getItem("wallet_list"));
  if (localStorage.getItem("wallet_list")) {
    let wallet_list = localStorage.getItem("wallet_list").split(",");
    for (var w in wallet_list) {
      if (localStorage.getItem(wallet_list[w])) {
        wallets.push({
          account: wallet_list[w],
          ...JSON.parse(localStorage.getItem(wallet_list[w])),
        });
      }
    }
  }
  console.log("WALLETS ///::: ", wallets);
  return wallets;
} */

// save our state (isPanel open or not)
export const store = Vue.observable({
  account: null,
  isNavOpen: false,
  wallets: {
    current:
      (store && store.wallets && store.wallets.current) ||
      (localStorage.getItem('current_wallet') &&
        JSON.parse(localStorage.getItem('current_wallet'))) ||
      null,
    list: [] /* getWallets() */,
  },
});

export const getters = {
  currentWallet: () => {
    return (
      (store && store.wallets && store.wallets.current) ||
      (localStorage.getItem('current_wallet') &&
        JSON.parse(localStorage.getItem('current_wallet'))) ||
      null
    );
  },
};

// We call toggleNav anywhere we need it in our app
export const mutations = {
  toggleNav() {
    store.isNavOpen = !store.isNavOpen;
  },
  async setAccount(account) {
    store.account = account;
  },
  setCurrentWallet(wallet) {
    if (wallet) {
      localStorage.setItem('current_wallet', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('current_wallet');
    }
    store.wallets.current = wallet;
  },
  setWalletsList(walletsList) {
    store.wallets.list = walletsList;
  },
};
