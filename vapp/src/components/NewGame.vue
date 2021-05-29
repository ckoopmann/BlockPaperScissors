<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Start New Game
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New Game </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="['Block', 'Paper', 'Scissors']"
                  label="Move"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Secret"
                  hint="Will be hashed and used to encrypt your Move"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Opponent Address"
                  hint="Address of the account who you want to challenge for a game"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Create Game
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import GameDetails from "./GameDetails";

export default {
  data() {
    return {
      dialog: false,
      contractName: "BlockPaperScissors",
      method: "getPlayerGames",
      toUtf8: false,
      toAscii: false,
    };
  },

  components: { GameDetails },

  computed: {
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
};
</script>
<style scoped>
.stale {
  /* Release the inner Jackson Pollock */
  border: 1px solid red;
  background-color: yellow;
}
</style>
