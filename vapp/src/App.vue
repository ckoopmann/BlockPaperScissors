<template>
  <v-app id="app">
    <TheHeader />
    <router-view style="height:100%" />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TheHeader from "./components/TheHeader.vue";

export default {
  name: "app",
  components: { TheHeader },

  computed: {
    ...mapGetters("contractModule", ["contractInstance", "gameIds"]),
  },
  methods: {
    ...mapActions("web3Module", ["initializeWeb3", "registerUpdateListener"]),
    ...mapActions("contractModule", ["initializeContract", "loadGames", "registerContractEventListeners"]),
  },
  async mounted() {
    await this.initializeWeb3();
    this.initializeContract();
    console.log("Active Account: ", this.activeAccount);
    console.log("contract instance: ", this.contractInstance);
    await this.loadGames();
    console.log("Game Ids", this.gameIds);
    await this.registerUpdateListener();
    this.registerContractEventListeners();
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100vh;
}
</style>
