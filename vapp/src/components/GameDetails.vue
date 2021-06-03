<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-title primary-title class="justify-center">
      {{ title }}</v-card-title
    >
    <v-card-text>
      <v-container>
        <v-row class="justify-center">Opponent: {{ opponent }}</v-row>
        <v-row v-if="isEvaluated" class="justify-center">Your Move: {{ userMove }}</v-row>
        <v-row v-if="isEvaluated" class="justify-center">Opponent Move: {{ opponentMove }}</v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <component
        :is="actionComponent"
        :gameId="gameId"
        class="mb-4"
      ></component>
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
  computed: {
    ...mapGetters("contractModule", ["gameDataSingle"]),

    gameData() {
      return this.gameDataSingle(this.gameId);
    },

    title() {
      return this.gameData.title;
    },

    userMove() {
      let move;
      if (this.userIsFirstPlayer) {
        move = this.gameData.firstMove;
      } else {
        move = this.gameData.secondMove;
      }
      if (move == "None") {
        return null;
      } else {
        return move;
      }
    },

    opponentMove() {
      let move;
      if (this.userIsFirstPlayer) {
        move = this.gameData.secondMove;
      } else {
        move = this.gameData.firstMove;
      }
      if (move == "None") {
        return null;
      } else {
        return move;
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
    
      isEvaluated(){
          return this.gameData.state === "Evaluated";
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
