<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div v-if="isDrizzleInitialized" id="app">

        <div class="section">
          <h2>Show the Accounts</h2>
          <drizzle-account units="Ether" :precision="2" />
        </div>

        <div class="section">
          <h2>Block Paper Scissors</h2>
          <BlockPaperScissors />
        </div>

      </div>
      <div v-else>Loading...</div>
    </v-main>
  </v-app>
</template>

<script>
import TutorialToken from "./TutorialToken";
import BlockPaperScissors from "./BlockPaperScissors";
import SimpleStorage from "./SimpleStorage";
import ComplexStorage from "./ComplexStorage";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    ComplexStorage,
    TutorialToken,
    BlockPaperScissors,
    SimpleStorage,
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
