<template>
  <v-card>
    <v-card-title> {{ gameData.state }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>First Player: {{ gameData.firstPlayer }}</v-row>
        <v-row>Second Player: {{ gameData.secondPlayer }}</v-row>
        <v-row>Game Id: {{ gameId }}</v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

// Mappings of solidity enum indexes on label
const states = ["None", "Started", "Played", "Evaluated"];
const moves = ["None", "Block", "Paper", "Scissors"];
const results = ["None", "Player 1 Wins", "Player 2 Wins", "Draw"];

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
    ...mapGetters("accounts", ["activeAccount"]),
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

      if (contractData != "loading") {
        return {
          state: states[parseInt(contractData["0"])],
          firstPlayer: this.parseAddress(contractData["1"]),
          secondPlayer: this.parseAddress(contractData["2"]),
          firstMoveEncrypted: contractData["3"],
          firstMoveSecret: contractData["4"],
          firstMove: moves[parseInt(contractData["5"])],
          secondMove: moves[parseInt(contractData["6"])],
          result: results[parseInt(contractData["7"])],
        };
      }
      return contractData;
    },
  },
  methods: {
    parseAddress(address) {
      if (address === this.activeAccount) {
        return "YOU";
      } else {
        return address;
      }
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
