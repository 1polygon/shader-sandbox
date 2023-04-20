<script setup>
import app from "../store/app.js";
</script>

<template>
    <v-app-bar :elevation="2" :height="app.state.route?.name == 'editor' ? 50 : undefined">
        <v-app-bar-title>Shader Sandbox</v-app-bar-title>
        <template v-slot:prepend>
            <v-btn icon="mdi-drawing-box" to="/"></v-btn>
        </template>
        <template v-slot:append>
            <v-btn rounded href="https://github.com/1polygon/shader-sandbox" target="_blank">
                <img width="20" src="@/assets/github-mark-white.svg" />
            </v-btn>
        </template>
    </v-app-bar>
</template>