<template>
  <div class="game-list">
    <h2 class="mt-4">Your Games</h2>
    <v-row class="fill-height" align="center" justify="center">
      <GameDetails v-for="(id, index) in gameIds" :key="index" :gameId="id" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GameDetails from "../components/GameDetails";

export default {
  components: { GameDetails },
  computed: mapGetters("contractModule", ["gameIds"]),
};
</script>
<style scoped>
.game-list {
  background-image: url(/assets/ethereum.jpg);
  background-size: cover; /* <------ */
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
