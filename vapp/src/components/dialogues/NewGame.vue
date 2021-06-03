<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" dark v-bind="attrs" v-on="on">
          New Game
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
                <v-col cols="12">
                  <v-text-field
                    label="Title"
                    hint="This Game Title will be visible to everyone so don't include any secret information"
                    v-model="title"
                    required
                    persistent-hint
                  ></v-text-field>
                </v-col>
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
                  <v-combobox
                    label="Opponent Address"
                    hint="Address of the account who you want to challenge for a game"
                    v-model="opponent"
                    :rules="[validAddress, notNullAddress, distinctAddress]"
                    :items="previousOpponents"
                    required
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" text @click="close">
              Close
            </v-btn>
            <v-btn color="white" text type="submit">
              Create Game
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      opponent: "",
      secret: "",
      move: "",
      title: "",
    };
  },

  computed: {
    ...mapGetters("web3Module", ["activeAccount", "web3Instance"]),
    ...mapGetters("contractModule", ["previousOpponents"]),
  },

  methods: {
    ...mapActions("contractModule", ["startGame"]),
    async submit(event) {
      const { title, opponent, secret, move } = this;
      await this.startGame({title, opponent, secret, move });
      this.dialog = false;
    },
    close() {
      this.dialog = false;
    },
    validAddress(address) {
      return (
        this.web3Instance.utils.isAddress(address) ||
        "Please provide a valid address"
      );
    },
    notNullAddress(address) {
      return (
        address !== "0x0000000000000000000000000000000000000000" ||
        "Cannot play against 0 address"
      );
    },
    distinctAddress(address) {
      return address != this.activeAccount || "Cannot play against yourself";
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
