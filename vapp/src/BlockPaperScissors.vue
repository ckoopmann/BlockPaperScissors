<template>
  <div v-if="isDrizzleInitialized">
    <p>{{ contractData }}</p>

  </div>

  <div v-else>Loading...</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      contractName: "BlockPaperScissors",
      method: "getPlayerGames",
      toUtf8: false,
      toAscii: false,
    };
  },

  computed: {
    ...mapGetters("accounts", ["activeAccount"]),
    ...mapGetters("contracts", ["getContractData", "contractInstances"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized"]),

    methodArgs() {
      return [this.activeAccount];
    },

    isStale() {
      return !this.contractInstances[this.contractName].synced;
    },

    contractData() {
      const arg = {
        contract: this.contractName,
        method: this.method,
        toUtf8: this.toUtf8,
        toAscii: this.toAscii,
      };
      let contractData = this.getContractData(arg);

      return contractData;
    },
  },

  created() {
    const { contractName, method, methodArgs } = this;

    this.$store.dispatch("drizzle/REGISTER_CONTRACT", {
      contractName,
      method,
      methodArgs,
    });
  },
};
</script>
<style scoped>
.stale {
  /* Release the inner Jackson Pollock */
  border: 1px solid red;
  background-color: yellow;
}
</style>
