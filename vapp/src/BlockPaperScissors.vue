<template>
  <div v-if="isDrizzleInitialized">
    <drizzle-contract
      contractName="BlockPaperScissors"
      method="getPlayerGames"
      label="Your Game Ids"
      :methodArgs="accounts"
    />

    <ul>
      <li v-for="gameId in gameIds" :key="gameId">{{ gameId }}</li>
    </ul>
    <drizzle-contract-form
      contractName="BlockPaperScissors"
      method="startGame"
      :placeholders="placeholders"
    />
  </div>

  <div v-else>Loading...</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BlockPaperScissors",
  computed: {
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized", "isDrizzleSynced"]),
    ...mapGetters("contracts", ["getContractData"]),

    accounts() {
      return [this.activeAccount];
    },

    placeholders() {
      return ["Opponent Address", "Encrypted Move"];
    },

    gameIds() {
      if (this.isDrizzleInitialized) {
        if (this.isDrizzleSynced) {
          console.log("Getting Game Ids for Address: ", this.accounts);
          <!-- const idList = this.getContractData({ -->
          <!--   contractName: "BlockPaperScissors", -->
          <!--   method: "getPlayerGames", -->
          <!--   methodArgs: this.accounts, -->
          <!-- }); -->
          if (idList == "loading") {
            return ["loading"];
          } else {
            return idList;
          }
        } else {
          return ["not synced"];
        }
      } else {
        return ["notInitialized"];
      }
    },
  },
};
</script>

<style></style>
