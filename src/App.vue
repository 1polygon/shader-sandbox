<script setup>
import Header from "./components/Header.vue";
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