<template>
  <div class="network-container">
    <span>
      <a
href="https://wallet-testnet.blockchain.ki"><span
        v-if="this.globalData.kichain.network.network == 'Devnet'"
        class="clear-link"
      >Go to Testnet</span>
      </a>
      <a
href="https://wallet-devnet.blockchain.ki"><span
        v-if="this.globalData.kichain.network.network == 'Testnet'"
        class="clear-link"
      >Go to Devnet</span>
      </a>
    </span>
  </div>
</template>
<script>
export default {};
</script>
