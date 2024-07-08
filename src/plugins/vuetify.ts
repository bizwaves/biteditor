// Styles

import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

import '@mdi/font/css/materialdesignicons.css'      // To Use Local Icons, Ensure Local you are using css-loader

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    icons: {
      iconfont: 'mdi', // To Use Local Icons, default - only for display purposes
    },
  }
)
