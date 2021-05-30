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
        <form @submit.prevent="submit">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-select
                    :items="['Block', 'Paper', 'Scissors']"
                    label="Move"
                    v-model="move"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Secret"
                    hint="Copy / Remember this value to reveal/decrypt your move later"
                    v-model="secret"
                    required
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Opponent Address"
                    hint="Address of the account who you want to challenge for a game"
                    v-model="opponent"
                    :rules="[validAddress, notNullAddress, distinctAddress]"
                    required
                  ></v-text-field>
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
              Create Game
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      contractName: "BlockPaperScissors",
      method: "startGame",
      toUtf8: false,
      toAscii: false,
      opponent: "",
      secret: "",
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
      console.log(this.opponent, this.secret, this.move);
      const hashedSecret = this.utils.sha3(this.secret);
      console.log(hashedSecret);
      console.log(this.contract.methods);
      const encryptedMove = await this.contract.methods
        .encryptMove(1, hashedSecret)
        .call();
      console.log("Encrypted Move: ", encryptedMove);

      const result = await this.contract.methods
        .startGame(this.opponent, encryptedMove)
        .send({ from: this.activeAccount });
      console.log("Result: ", result);

      this.dialog = false;
    },
    close() {
      this.dialog = false;
    },
    validAddress(address) {
      return this.utils.isAddress(address) || "Please provide a valid address";
    },
    notNullAddress(address) {
        return (address !== "0x0000000000000000000000000000000000000000") || "Cannot play against 0 address";
    },
    distinctAddress(address) {
        return (address != this.activeAccount) || "Cannot play against yourself";
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
