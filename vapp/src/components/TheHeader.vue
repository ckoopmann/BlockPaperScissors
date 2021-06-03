<template>
  <v-app-bar app color="blue-grey darken-2" class="p-4" dark>
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
</template>

<script>
import NewGame from "./dialogues/NewGame.vue";
export default {
  components: { NewGame },
};
</script>
