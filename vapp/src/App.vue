<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="assets/block.png"
          transition="scale-transition"
          width="40"
        />
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="assets/paper.png"
          transition="scale-transition"
          width="40"
        />
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="assets/scissors.png"
          transition="scale-transition"
          width="40"
        />

      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/ckoopmann/GameOverview"
        target="_blank"
        text
      >
        <span class="mr-2">Github Repo</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div v-if="isDrizzleInitialized" id="app">

        <div class="section mb-4">
          <NewGame />
        </div>

        <div class="section">
          <GameOverview />
        </div>


        <div class="section">
          <h2>Show the Accounts</h2>
          <drizzle-account units="Ether" :precision="2" />
        </div>


      </div>
      <div v-else>Loading...</div>
    </v-main>
  </v-app>
</template>

<script>
import GameOverview from "./components/GameOverview";
import NewGame from "./components/dialogues/NewGame";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    GameOverview,
    NewGame,
  },

  computed: mapGetters("drizzle", ["isDrizzleInitialized"]),
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
}
</style>
