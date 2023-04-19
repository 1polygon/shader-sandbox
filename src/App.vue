<script setup>
import { useRoute, useRouter } from "vue-router";
import Header from "./components/Header.vue";
import app from "./store/app.js";
const router = useRouter();
const route = useRoute();
router.beforeEach((to, from) => {
  app.state.route = to;
});
app.state.route = route;
</script>

<template>
  <v-app>
    <Header />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
main {
  background-color: #0b0b0b;
}

@keyframes fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

main>div {
  animation: fade .2s ease-in-out;
}
</style>
<style>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.25s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.7);
  opacity: 0;
}
</style>