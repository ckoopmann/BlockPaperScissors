<template>
  <v-app id="app">
    <TheHeader />
    <router-view style="height:100%" />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import TheHeader from "./components/TheHeader.vue";

export default {
  name: "app",
  components: { TheHeader },

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
  height: 100vh;
}
</style>
