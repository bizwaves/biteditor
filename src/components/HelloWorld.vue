<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/black-logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to BitEditor 1.0 Preview
        </h1>

        <h4> build no. 2024020201</h4>
        <br>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Bitwaves developers,
          <br>please join our online
          <a
            href="https://www.bitwaves.org/"
            target="_blank"
          >Bitwaves Community</a>
        </p>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'HelloWorld',

  data () {
    return {
    }
  },
})
</script>
