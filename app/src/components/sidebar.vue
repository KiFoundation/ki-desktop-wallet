<template>
  <div>
    <div
      v-if="isPanelOpen"
      class="sidebar-backdrop"
      @click="closeSidebarPanel"
    />
    <transition name="slide">
      <div>
        <section v-if="isPanelOpen && account"
class="user-info text-center">
          <div class="avator">
            <img
              :src="
                '@static/img/chain/' + blockchain_lowercase + '_icon@2x.png'
              "
              width="90%"
            />
          </div>
          <h4>{{ blockchain }} Wallet</h4>
          <h5>{{ accountName }}</h5>
          <p id="copyContent"
style="margin-top:10px;margin-bottom:10px;">
            {{ account }}
          </p>
          <h6 class="grey-fsz">
            <b-badge v-if="vesting"
class="badge">
              Vesting
            </b-badge>
            <b-badge v-if="multisig"
class="badge">
              Multisig
            </b-badge>
          </h6>

          <div class="operation-list">
            <a class="grey-fsz"
@click="removeWallet">{{
              $t("webwallet_remove_wallet")
            }}</a>
          </div>

          <div class="token-info">
            <p>{{ $t("webwallet_total") }} {{ token }}</p>
            <h4>{{ webUtil.addCommas(balances.sum, 6) }}</h4>
            <!-- <p class="grey-fsz">≈ {{webUtil.addCommas(balances[unit])}} {{unit}}</p> -->
            <ul class="token-list">
              <li v-for="(item, index) in balances.list"
:key="index">
                <div>{{ $t(index) }} {{ token }}</div>
                <div>{{ item ? webUtil.addCommas(item, 6) : 0 }}</div>
              </li>
              <li>
                <div>Sequence</div>
                <div>{{ sequence }}</div>
              </li>
            </ul>
          </div>

          <div class="wallet-list">
            <b-table
              ref="selectableTable"
              sticky-header
              no-border-collapse
              hover
              borderless
              selectable
              select-mode="single"
              :items="items"
              :fields="fields"
              head-variant="null"
              responsive="sm"
              @row-selected="onRowSelected"
            >
              <template #cell(selected)="{ rowSelected }">
                <template v-if="rowSelected">
                  <span aria-hidden="true">&check;</span>
                  <span class="sr-only">Selected</span>
                </template>
                <template v-else>
                  <span aria-hidden="true">&nbsp;</span>
                  <span class="sr-only">Not selected</span>
                </template>
              </template>
            </b-table>
          </div>
          <div class="refresh-logout">
            <a class="grey-fsz refresh"
@click="refresh">{{
              $t("webwallet_refresh")
            }}</a>
            <a class="grey-fsz logout"
@click="logout">{{
              $t("webwallet_logout")
            }}</a>
          </div>
        </section>

        <section v-if="!account && isPanelOpen"
class="user-info text-center">
          <div class="avator">
            <img
              :src="
                '@static/img/chain/' + blockchain_lowercase + '_icon@2x.png'
              "
              width="90%"
            />
          </div>
          <h4>{{ blockchain }} Wallet</h4>
          <div class="token-info">
            Selest an account to use
          </div>

          <div class="wallet-list">
            <b-table
              ref="selectableTable"
              sticky-header
              no-border-collapse
              hover
              borderless
              selectable
              select-mode="single"
              :items="items"
              :fields="fields"
              head-variant="null"
              responsive="sm"
              @row-selected="onRowSelected"
            >
              <template #cell(selected)="{ rowSelected }">
                <template v-if="rowSelected">
                  <span aria-hidden="true">&check;</span>
                  <span class="sr-only">Selected</span>
                </template>
                <template v-else>
                  <span aria-hidden="true">&nbsp;</span>
                  <span class="sr-only">Not selected</span>
                </template>
              </template>
            </b-table>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>
<script>
import Vue from "vue";
import common from "@static/js/common.js";
import { store, mutations } from "@store";

import {
  BootstrapVue,
  IconsPlugin,
  BTable,
  BButton,
  BBadge
} from "bootstrap-vue";
Vue.component("BTable", BTable);
Vue.component("BButton", BButton);
Vue.component("BBadge", BBadge);

export default {
  props: [
    "account",
    "balances",
    "blockchain",
    "sequence",
    "accountName",
    "items",
    "vesting",
    "multisig"
  ],
  data() {
    return {
      unit: this.webCoin.unit,
      blockchain_lowercase: "",
      nodeUrl: "",
      network: "",
      token: "",
      fields: [
        "account",
        {
          key: "address",
          formatter: value => {
            return value.substring(0, 24) + "...";
          }
        }
      ],
      selectMode: "single",
      selected: [],
      selected_index: 0
    };
  },

  computed: {
    isPanelOpen() {
      return store.isNavOpen;
    }
  },
  created() {
    this.getChain();
    this.selected_index = this.items.findIndex(
      p => p.account == this.accountName
    );
  },

  mounted() {
    this.copyAddress();
    this.getUnit();
  },

  methods: {
    closeSidebarPanel: mutations.toggleNav,

    onRowSelected(items) {
      this.selected = items;
      this.switchAccount();
    },

    switchAccount() {
      let chainid = this.network.chainId;
      if (!(this.selected.length > 0)) {
        alert("select an account");
      } else {
        // var confirmed = confirm("You will switch to the selected account");
        var confirmed = true;

        if (confirmed) {
          let identity =
            '{"blockchain":"cosmos","chainId":"' +
            chainid +
            '","account":' +
            JSON.stringify(this.selected[0].address) +
            ', "accountName": ' +
            JSON.stringify(this.selected[0].account) +
            ', "privatekey": ' +
            JSON.stringify(this.selected[0].privatekey) +
            ', "publickey": ' +
            JSON.stringify(this.selected[0].publickey) +
            "}";

          localStorage.setItem(
            "identity_" + this.blockchain_lowercase,
            identity,
            {
              expires: 30,
              path: "/"
            }
          );
          this.$emit("sendAccount", identity);

          this.refresh();
        }
      }
    },

    refresh() {
      window.location.reload();
    },

    getChain() {
      if (this.blockchain) {
        let blockchain = this.blockchain.toLowerCase();
        this.blockchain_lowercase = blockchain;
        this.nodeUrl = this.globalData[blockchain].nodeUrl;
        this.network = this.globalData[blockchain].network;
        this.token = this.globalData[blockchain].token;
      }
    },
    logout() {
      localStorage.setItem("identity_" + this.blockchain_lowercase, "", {
        expires: -30,
        path: "/"
      });
      window.location.reload();
    },
    copyAddress() {
      var clipboard = new this.clipboard("#copyBtn");
      clipboard.on("success", element => {
        //复制成功的回调
        alert(this.$t("copy_success"));
      });
      clipboard.on("error", element => {
        //复制失败的回调
        alert(this.$t("copy_fail"));
      });
    },
    getUnit() {
      // 用$on事件来接收参数
      common.$on("val", data => {
        this.unit = data;
      });
    },
    removeWallet() {
      var confirmed = confirm("Are you sure you want to delete this wallet?");

      if (confirmed) {
        localStorage.removeItem(this.accountName);
        if (localStorage.getItem("wallet_list")) {
          let wallet_list = localStorage
            .getItem("wallet_list")
            .replace(this.accountName + ",", "");
          localStorage.setItem("wallet_list", wallet_list);
        }
        if (this.items.length > 0) {
          this.selected = [this.items[this.selected_index + 1]];
          this.switchAccount();
        }
      }
    }
  }
};
</script>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}

.sidebar-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 1;
}

.sidebar-panel {
  overflow-y: auto;
  background-color: #130f40;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 999;
  padding: 3rem 20px 2rem 20px;
  width: 300px;
}
</style>
