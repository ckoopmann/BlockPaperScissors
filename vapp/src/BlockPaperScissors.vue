<template>
  <div v-if="isDrizzleInitialized">
    <h2>Your Games</h2>
    <GameDetails v-for="(id, index) in gameIds" :key="index" :gameId="id" />
  </div>

  <div v-else>Loading...</div>
</template>

<script>
import { mapGetters } from "vuex";
import GameDetails from "./GameDetails";

export default {
  data() {
    return {
      contractName: "BlockPaperScissors",
      method: "getPlayerGames",
      toUtf8: false,
      toAscii: false,
    };
  },

  components: { GameDetails },

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

    gameIds() {
      const arg = {
        contract: this.contractName,
        method: this.method,
        toUtf8: this.toUtf8,
        toAscii: this.toAscii,
      };
      let contractData = this.getContractData(arg);

      if (contractData === "loading") {
        return [];
      }
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
