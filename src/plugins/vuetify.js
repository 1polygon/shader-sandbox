// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import colors from "vuetify/lib/util/colors";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: true,
        colors: {
          primary: "#86682f",
          primarylight: "#8E24AA",
        }
      },
    },
  },
})
