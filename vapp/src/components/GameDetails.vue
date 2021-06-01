<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-title primary-title class="justify-center">
      {{ gameData.state }}</v-card-title
    >
    <v-card-text>
      <v-container>
        <v-row class="justify-center">Opponent: {{ opponent }}</v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <component
        :is="actionComponent"
        :gameId="gameId"
        v-if="gameDataLoaded"
        class="mb-4"
      ></component>
      <h2 v-else>Loading</h2>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import MakeMove from "./dialogues/MakeMove";
import RevealMove from "./dialogues/RevealMove";
import WonGame from "./dialogues/WonGame";
import LostGame from "./dialogues/LostGame";
import Draw from "./dialogues/Draw";
import WaitForOpponent from "./dialogues/WaitForOpponent";

// Mappings of solidity enum indexes on label
const states = ["None", "Started", "Played", "Evaluated"];
const moves = ["None", "Block", "Paper", "Scissors"];
const results = ["None", "Player 1 Wins", "Player 2 Wins", "Draw"];

export default {
  components: {
    MakeMove,
    RevealMove,
    WonGame,
    LostGame,
    Draw,
    WaitForOpponent,
  },
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

    gameDataLoaded() {
      return this.gameData != null && this.gameData !== "loading";
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

    userIsFirstPlayer() {
      return this.gameData.firstPlayer === "YOU";
    },

    opponent() {
      if (this.userIsFirstPlayer) {
        return this.gameData.secondPlayer;
      }
      return this.gameData.firstPlayer;
    },

    isUsersTurn() {
      if (this.userIsFirstPlayer) {
        return this.gameData.state === "Played";
      } else {
        return this.gameData.state === "Started";
      }
    },

    gameResult() {
      if (["None", "Draw"].includes(this.gameData.result)) {
        return this.gameData.result;
      } else {
        const userPlayerNumber = this.userIsFirstPlayer ? "1" : "2";
        if (this.gameData.result.includes(userPlayerNumber)) {
          return "WonGame";
        } else {
          return "LostGame";
        }
      }
    },

    statusMessage() {
      if (this.isUsersTurn) {
        return "Its your turn";
      } else {
        if (this.gameData.state === "Evaluated") {
          return this.gameResult;
        }
        return "Waiting for opponent";
      }
    },

    actionComponent() {
      if (this.isUsersTurn) {
        if (this.userIsFirstPlayer) {
          return "RevealMove";
        }
        return "MakeMove";
      } else if (this.gameResult === "None") {
        return "WaitForOpponent";
      }
      return this.gameResult;
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
