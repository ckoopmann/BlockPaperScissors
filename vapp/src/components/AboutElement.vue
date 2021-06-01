<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-title primary-title class="justify-center">{{
      title
    }}</v-card-title>
    <v-card-text>
      <v-container class="text-left"><slot></slot></v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: { title: { type: String, required: true } },
};
</script>

<style>
ul {
  list-style-position: inside;
}
</style>
