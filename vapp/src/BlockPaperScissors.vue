<template>
  <div v-if="isDrizzleInitialized">
    <drizzle-contract
      contractName="BlockPaperScissors"
      method="getPlayerGames"
      label="Your Game Ids"
      :methodArgs="accounts"
    />

  </div>

  <div v-else>Loading...</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BlockPaperScissors',
  computed: {
    ...mapGetters('accounts', ['activeAccount', 'activeBalance']),
    ...mapGetters('drizzle', ['isDrizzleInitialized']),

    accounts() {
      return [this.activeAccount]
    },

    placeholders() {
      return ['To Address', 'Amount to Send']
    }
  }
}
</script>

<style></style>
