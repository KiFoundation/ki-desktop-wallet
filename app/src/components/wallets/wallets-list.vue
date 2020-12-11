<template>
<div>
  <b-row v-if="list.length" class="w-100 mx-0 pl-3">
    <div class="accordion">
      <div class="accordion-item" v-for="(content, i) in contents" v-bind:key="i" v-bind:class="{ 'accordion-active': content.active }">
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
            <b-col v-for="(wallet, index) in content.list" :key="index" cols="4" :class="[
                'mb-3 pl-0 pr-3',
              ]">
              <WalletCard :wallet="wallet" @onSelectWallet="onSelectWallet" />
            </b-col>
          </b-row>
        </div>

        </div>
      </div>
    </div>
  </b-row>
  <b-row v-else>
    <b-col>
      No wallets
    </b-col>
  </b-row>
</div>
</template>

<script>
import {
  BRow,
  BCol
} from 'bootstrap-vue';
import WalletCard from '@cmp/wallets/wallet-card';
// import WalletAcc from '@cmp/wallets/wallets-accordion';
import {  mapState } from 'vuex';
import gsap from 'gsap'

export default {
  components: {
    WalletCard,
    // WalletAcc,
    BRow,
    BCol,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      list: state => state.wallets.list,
    }),
    contents() {
      return {
        personal: {
        title: 'Personal',
        description: 'Personal wallets',
        active: false,
        list: [],
      },
      work:{
        title: 'Work',
        description: 'Work wallets',
        active: false,
        list: [],
      },
      multisig: {
        title: 'Multisig',
        description: 'Multisig wallets',
        active: false,
        list: [],
      },
      uncategorised: {
        title: 'Uncategorised',
        description: 'Other wallets',
        active: false,
        list: [],
      }
    }
    }
  },
  created() {
    this.splitCategories();
  },
  mounted(){
    this.expandDefault();

  },
  methods: {
    splitCategories(){
      for (var wallet of this.list){
        this.contents[wallet.category].list.push(wallet);
      }
      // console.log(this.contents)
    },

    expandDefault(){
      console.log(this.$refs['accordion-body-uncategorised'])
      let el = this.$refs['accordion-body-uncategorised'][0];
      this.contents.uncategorised.active = true;

      gsap.to(el, 1, {
        height: el.scrollHeight,
        ease: "elastic(1, 0.9)"
      });
    },
    expand(i) {
      event.preventDefault();

      let el = this.$refs['accordion-body-' + i][0];
      if (this.contents[i].active === false) {
        this.contents[i].active = true;

        gsap.to(el, 1, {
          height: el.scrollHeight,
          ease: "elastic(1, 0.9)"
        });
      } else {
        this.contents[i].active = false;

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
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 0.2rem;
  transition: background-color 200ms ease-in-out;

}
.accordion-header a:not(.accordion-active):hover {
  /* background-color: #d8d2ef8f; */
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

.accordion-caret {
	background-image: linear-gradient(
  	to top right,
  	transparent 50%,
  	#727272 50%
  );
	width: 0.5rem;
	height: 0.5rem;
	transform: rotate(-45deg);
	animation: accordion-is-inactive 200ms linear forwards;
}

.accordion-body {
	height: 0;
	overflow: hidden;
}

.accordion-content {
	padding: 1rem;
}

@keyframes accordion-is-inactive {
	0%   { transform: rotate(-45deg); }
	50%  { transform: scale(1.5) rotate(45deg); }
	100% { transform: rotate(135deg); }
}

@keyframes accordion-is-active {
	0%   { transform: rotate(135deg); }
	50%  { transform: scale(1.5) rotate(45deg); }
	100% { transform:  rotate(-45deg); }
}

@media screen and (min-width: var(--base-width) {
	#app {
		padding: 2rem;
		overflow: auto;
	}

	.accordion {
		max-height: none;
		border-radius: 0.5rem;
	}
}
</style>
