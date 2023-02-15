<template>
  <div>
    <b-row v-if="list.length" class="w-100 mx-0 pl-3">
      <div class="accordion">
        <div
          class="accordion-item"
          v-for="(content, i) in categories"
          v-bind:key="i"
          v-bind:class="{ 'accordion-active': content.active }"
        >
          <div v-if="content.list.length != 0">
            <div class="accordion-header">
              <a href="#" v-on:click="expand(i)">
                <div class="accordion-header-div">{{ content.title }}</div>
                <div class="accordion-header-div">
                  <div class="accordion-caret" />
                </div>
              </a>
            </div>
            <div class="accordion-body" v-bind:ref="'accordion-body-' + i">
              <b-row class="w-100 mx-0 pl-3">
                <b-col
                  v-for="(wallet, index) in content.list"
                  :key="index"
                  cols="4"
                  :class="['mb-3 pl-0 pr-3']"
                >
                  <WalletCard :wallet="wallet" @onSelectWallet="onSelectWallet" />
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>
    </b-row>
    <b-row v-else>
      <b-col> No wallets </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { BRow, BCol } from 'bootstrap-vue';
import WalletCard from '@cmp/wallets/wallet-card.vue';
// import WalletAcc from '@cmp/wallets/wallets-accordion';
import { mapState } from 'vuex';
import gsap from 'gsap';

export default {
  components: {
    WalletCard,
    // WalletAcc,
    BRow,
    BCol,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      list: (state) => state.wallets.list,
      categories_raw: (state) => state.wallets.categories,
    }),
    categories() {
      var categories_ = {};
      for (var cat of this.categories_raw) {
        categories_[cat] = {
          title: cat,
          active: false,
          list: [],
        };
      }
      return categories_;
    },
  },
  created() {
    this.splitCategories();
  },
  mounted() {
    this.expandDefault();
  },
  methods: {
    splitCategories() {
      for (var wallet of this.list) {
        if (wallet.category != undefined && wallet.category in this.categories) {
          this.categories[wallet.category].list.push(wallet);
        } else {
          this.categories['uncategorized'].list.push(wallet);
        }
      }
    },

    expandDefault() {
      for (var i in this.categories) {
        if (this.categories[i].list.length > 0) {
          let el = this.$refs['accordion-body-' + i][0];
          this.categories[i].active = true;

          gsap.to(el, 1, {
            height: el.scrollHeight,
            ease: 'elastic(1, 0.9)',
          });
        }
      }
    },
    expand(i) {
      event.preventDefault();

      let el = this.$refs['accordion-body-' + i][0];
      if (this.categories[i].active === false) {
        this.categories[i].active = true;

        gsap.to(el, 1, {
          height: el.scrollHeight,
          ease: 'elastic(1, 0.9)',
        });
      } else {
        this.categories[i].active = false;

        gsap.to(el, 0.5, {
          height: 0,
          // ease: "bounce"
        });
      }
    },
    onSelectWallet(wallet) {
      this.$emit('onSelectWallet', wallet);
    },
  },
};
</script>

<style scoped>
.accordion,
.accordion-item,
.accordion-header,
.accordion-body {
  font-family: inherit;
}

.accordion {
  /* background-color: #ffffff; */
  width: 100%;
  max-height: 100%;
  /* max-width: 320px;  */
  padding: 2rem 1rem;
  margin: auto;
  box-sizing: border-box;
  overflow: auto;
  /* box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3); */
}

.accordion-item.accordion-active.accordion-caret {
  animation: accordion-is-active 200ms linear forwards;
}

.accordion-header {
  color: inherit;
  font-size: 1.2rem;
  font-weight: bold;
  position: relative;
}

.accordion-header a {
  text-transform: capitalize;
  color: #2d1d67;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 0.2rem;
  transition: background-color 200ms ease-in-out;
}

.accordion-header-div {
  padding: 1rem 1rem 1rem 1rem;
}

.accordion-header-div:last-child {
  padding-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accordion-body {
  height: 0;
  overflow: hidden;
}

.accordion-content {
  padding: 1rem;
}
</style>
