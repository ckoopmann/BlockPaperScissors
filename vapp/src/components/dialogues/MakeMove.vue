<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Make your Move
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Make your Move</span>
        </v-card-title>
        <form @submit.prevent="submit">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="['Block', 'Paper', 'Scissors']"
                    label="Move"
                    v-model="move"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text type="submit">
              Make Move
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

const moveMapping = { Block: 1, Paper: 2, Scissors: 3 };

export default {
  props: {
    gameId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      contractName: "BlockPaperScissors",
      move: "",
    };
  },

  computed: {
    ...mapGetters("contracts", ["getContractData", "contractInstances"]),
    ...mapGetters("drizzle", ["drizzleInstance", "isDrizzleInitialized"]),
    ...mapGetters("accounts", ["activeAccount"]),

    isStale() {
      return !this.contractInstances[this.contractName].synced;
    },

    utils() {
      return this.drizzleInstance.web3.utils;
    },

    contract() {
      return this.drizzleInstance.contracts[this.contractName];
    },
  },

  methods: {
    async submit(event) {
      console.log(this.gameId, this.move);

      const moveNumber = moveMapping[this.move];

      const result = await this.contract.methods
        .makeMove(this.gameId, moveNumber)
        .send({ from: this.activeAccount });
      console.log("Result: ", result);

      this.dialog = false;
    },
    close() {
      this.dialog = false;
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
