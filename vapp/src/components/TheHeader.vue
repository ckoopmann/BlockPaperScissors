<template>
  <div>
    <v-app-bar app color="blue-grey darken-2" dark>
      <router-link to="/">
        <div class="d-flex align-center">
          <v-img
            class="shrink mr-2"
            contain
            src="assets/block.png"
            transition="scale-transition"
            width="40"
          />
          <v-img
            class="shrink mr-2"
            contain
            src="assets/paper.png"
            transition="scale-transition"
            width="40"
          />
          <v-img
            class="shrink mr-2"
            contain
            src="assets/scissors.png"
            transition="scale-transition"
            width="40"
          />
        </div>
      </router-link>

      <NewGame />

      <v-menu left bottom class="mr-4">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-btn to="/" text>
                <span class="mr-2">About</span>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn to="games" text>
                <span class="mr-2">Your Games</span>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn
                href="https://github.com/ckoopmann/BlockPaperScissors"
                target="_blank"
                text
              >
                <v-icon>mdi-github</v-icon>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <div v-if="walletConnected">
      <v-alert v-if="contractDeployed" color="green" class="mb-0" dense>
        Succesfully connected to the contract (<a :href="etherScanLink"
          >etherscan</a
        >).
      </v-alert>
      <v-alert v-else color="red lighten-2" class="mb-0" dense>
        Contract is not deployed on {{ networkType }} network please switch your
        network to the Goerli Test-Network.
      </v-alert>
    </div>
    <v-alert v-else color="red lighten-2" class="mb-0" dense>
        You do not seem to have Metamask connected to this site. To use this application
        you will have to <a href="https://metamask.io/download">install Metamask</a> and reload the page.
    </v-alert>
  </div>
</template>

<script>
import NewGame from "./dialogues/NewGame.vue";
import { mapGetters } from "vuex";
export default {
  components: { NewGame },
  computed: {
    ...mapGetters("contractModule", ["contractDeployed", "contractAddress"]),
    ...mapGetters("web3Module", ["networkType", "walletConnected"]),
    etherScanLink() {
      return `https://goerli.etherscan.io/address/${this.contractAddress}`;
    },
  },
};
</script>
