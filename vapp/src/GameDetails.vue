<template>
  <div v-if="isDrizzleInitialized">
    <h3>{{ gameId }}</h3>
  </div>

  <div v-else>Loading...</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: { gameId: { type: String, required: true } },
  computed: {
    ...mapGetters("drizzle", ["isDrizzleInitialized"]),
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
