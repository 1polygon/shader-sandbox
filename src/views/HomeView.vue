<template>
  <div class="container">
    <div class="title">Shader Sandbox</div>
    <div class="subtitle mt-1 mb-5">A simple GLSL online editor</div>
    <div class="actions">
      <v-btn to="/create" color="primary">Create a Shader</v-btn>
      <!--<span>OR</span>
      <v-btn disabled to="/browse">Browse Gallery</v-btn>-->
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-flow: column;
}
.actions {
  margin-top: 1em;
  display: flex;
  gap: 1em;
  align-items: center;
}
.actions span {
  color: gray;
}
.title {
  text-shadow: 0 0 25px rgba(255,255,255,0.4);
  font-size: 64px;
  font-weight: lighter;
}

.subtitle {
  color: #b0b0b0;
}
</style>
