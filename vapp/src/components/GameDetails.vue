<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-title primary-title class="justify-center">
      {{ state }}</v-card-title
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
    ...mapGetters("contractModule", ["gameDataAll"]),

    gameDataLoaded() {
      return this.gameData != null;
    },

    gameData() {
      return this.gameDataAll[this.gameId];
    },

    state() {
      if ("state" in this.gameData) {
        return this.gameData.state;
      } else {
        return "Loading";
      }
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
};
</script>
