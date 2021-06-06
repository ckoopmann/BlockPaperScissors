<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Reveal your Move
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Reveal your Move</span>
        </v-card-title>
        <form @submit.prevent="submit">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Secret"
                    hint="Enter the same secret that you used when creating the game"
                    v-model="secret"
                    required
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
              Close
            </v-btn>
            <v-progress-circular
              indeterminate
              color="primary"
              v-if="loading"
            ></v-progress-circular>
            <v-btn v-else color="blue darken-1" text type="submit">
              Reveal Move
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    gameId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      secret: "",
    };
  },

  methods: {
    ...mapActions("contractModule", ["evaluateGame"]),
    async submit(event) {
      const { gameId, secret } = this;

      try {
        this.loading = true;
        await this.evaluateGame({ gameId, secret });
        this.dialog = false;
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.dialog = false;
    },
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
