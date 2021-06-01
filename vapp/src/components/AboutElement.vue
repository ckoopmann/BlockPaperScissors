<template>
  <v-carousel-item :src="src" height="1000">
    <v-row class="fill-height" align="center" justify="center">
      <v-card class="mx-auto" max-width="800">
        <v-card-title primary-title class="justify-center">{{
          title
        }}</v-card-title>
        <v-card-text>
          <v-container class="text-left"><slot></slot></v-container>
        </v-card-text>
      </v-card>
    </v-row>
  </v-carousel-item>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    src: { type: String, required: true },
  },
};
</script>
