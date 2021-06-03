<template>
    <v-row>
      <v-card class="mx-auto" max-width="800">
        <v-card-title primary-title class="justify-center">{{
          title
        }}</v-card-title>
        <v-card-text>
          <v-container class="text-left text-body-1"><slot></slot></v-container>
        </v-card-text>
      </v-card>
    </v-row>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    src: { type: String, required: true },
  },
};
</script>
