<template>
  <div v-if="isDrizzleInitialized">
    <h3>{{ gameData }}</h3>
  </div>

  <div v-else>Loading...</div>
</template>

<script>
import { mapGetters } from "vuex";

// Mappings of solidity enum indexes on label
const states = ["None", "Started", "Played", "Evaluated"]
const moves = ["None", "Block", "Paper", "Scissors"]
const results = ["None", "Player 1 Wins", "Player 2 Wins", "Draw"]

export default {
  props: { gameId: { type: String, required: true } },
  data() {
    return {
      contractName: "BlockPaperScissors",
      method: "getGameData",
      toUtf8: false,
      toAscii: false,
    };
  },
  computed: {
    ...mapGetters("drizzle", ["isDrizzleInitialized"]),
    ...mapGetters("contracts", ["getContractData", "contractInstances"]),
    methodArgs() {
      return [this.gameId];
    },

    isStale() {
      return !this.contractInstances[this.contractName].synced;
    },

    gameData() {
      const arg = {
        contract: this.contractName,
        method: this.method,
        toUtf8: this.toUtf8,
        toAscii: this.toAscii,
      };
      let contractData = this.getContractData(arg);

        if(contractData != "loading"){
            return {
                state: states[parseInt(contractData["0"])],
                firstPlayer: contractData["1"],
                secondPlayer: contractData["2"],
                firstMoveEncrypted: contractData["3"],
                firstMoveSecret: contractData["4"],
                firstMove: moves[parseInt(contractData["5"])],
                secondMove: moves[parseInt(contractData["6"])],
                result: results[parseInt(contractData["7"])],
            }
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
