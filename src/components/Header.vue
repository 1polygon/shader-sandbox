<template>
    <v-app-bar :elevation="2">
        <v-app-bar-title>Shader Sandbox</v-app-bar-title>
        <template v-slot:prepend>
            <v-btn icon="mdi-drawing-box" to="/"></v-btn>
        </template>
        <template v-slot:append>
        </template>
    </v-app-bar>
</template>