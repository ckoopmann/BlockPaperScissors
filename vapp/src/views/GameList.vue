<template>
  <div class="game-list">
    <h2 class="mt-4 mb-4 white--text">Your Games</h2>
    <div v-if="gameDataLoaded">
      <v-row v-for="(id, index) in gameIds" :key="index" class="fill-height mb-4" align="center" justify="center">
        <GameDetails  :gameId="id" />
      </v-row>
    </div>
    <div v-else>
      <h2>Loading</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GameDetails from "../components/GameDetails";

export default {
  components: { GameDetails },
  computed: mapGetters("contractModule", ["gameIds", "gameDataLoaded"]),
};
</script>
<style scoped>
.game-list {
  background-image: url(/assets/ethereum.jpg);
  background-size: cover; /* <------ */
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  display: inline-table;
}
</style>
