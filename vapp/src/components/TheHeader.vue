<template>
  <v-app-bar app color="primary" dark>
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

    <v-app-bar-title>Block Paper Scissors</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn to="games" text>
      <span class="mr-2">Your Games</span>
    </v-btn>

    <v-btn
      href="https://github.com/ckoopmann/BlockPaperScissors"
      target="_blank"
      text
    >
      <span class="mr-2">Github Repo</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
  </v-app-bar>
</template>
