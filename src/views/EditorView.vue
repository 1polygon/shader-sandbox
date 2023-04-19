<script setup>
import { onMounted, ref, reactive, onUnmounted } from "vue";
import CodeEditor from "../components/CodeEditor.vue";
import { defaultShader } from "../resources/default-shader";
import { EditorViewport } from "../components/EditorViewport";
import PropertyEditor from "../components/PropertyEditor.vue";
import { Texture2D } from "@onepolygon/webgl-pbr";

let aceEditor = null;
const canvas = ref();
/**
 * @type {EditorViewport}
 */
let viewport;
const properties = new Map();
const state = reactive({
    tab: "fragment",
    vertex: defaultShader.vertex,
    fragment: defaultShader.fragment,
    code: defaultShader.fragment,
    error: {
        line: -1,
        message: ""
    }
});

onMounted(() => {
    viewport = new EditorViewport(canvas.value);
    requestAnimationFrame(compile);
    document.addEventListener("keydown", keydown);
});

onUnmounted(() => {
    document.removeEventListener("keydown", keydown);
});

function keydown(e) {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        compile();
    }
}

function updateCode(code) {
    if (state.tab == "fragment") {
        state.fragment = code;
    } else if (state.tab == "vertex") {
        state.vertex = code;
    }
}

function tabChange(tab) {
    if (tab == "fragment") {
        state.code = state.fragment;
    } else if (tab == "vertex") {
        state.code = state.vertex;
    }
}

function compile() {
    console.log("compile shader");
    state.error.line = -1;
    state.error.message = "";
    const shader = viewport.shader;
    const time = performance.now();
    shader.source.vertex = state.vertex;
    shader.source.fragment = state.fragment;
    try {
        shader.reload();
        const ms = performance.now() - time;
        console.log("done", ms + "ms");
        shader.use();
        applyAllUniforms();
    } catch (err) {
        console.error(err);
        const errIndex = err.indexOf ? err.indexOf("ERROR") : -1;
        if (errIndex != -1) {
            const args = err.substr().split(":");
            const line = args[3];
            state.error.line = line;
            state.error.message = err.substr(errIndex);
        } else {
            state.error.message = err;
        }
    }
}

function updateProperty(property) {
    // Remove old property/uniform if the key has been renamed
    if (property.prevKey) {
        properties.delete(property.prevKey);
        property.prevKey = undefined;
    }
    properties.set(property.key, property);

    if (!viewport) return;

    if (property.type == "color" || property.type == "vec4") {
        viewport.shader.setVector4(property.key, property.value);
    }
    if (property.type == "float") {
        viewport.shader.setFloat(property.key, property.value);
    }
    if (property.type == "vec2") {
        viewport.shader.setVector2(property.key, property.value);
    }
    if (property.type == "vec3") {
        viewport.shader.setVector3(property.key, property.value);
    }
    if (property.type == "texture") {
        if (property.value.texture) {
            property.value.texture.setSource(property.value.src);
        } else {
            property.value.texture = new Texture2D(property.value.src);
        }
        viewport.shader.setTexture(property.key, property.value.texture);
    }
}

function deleteProperty(property) {
    properties.delete(property.key);
    if (property.value.texture) {
        property.value.texture.destroy();
        property.value.texture = null;
    }
}

function applyAllUniforms() {
    for (const property of properties.values()) {
        updateProperty(property);
    }
    canvasResize();
}

function canvasResize() {
    if (viewport) {
        viewport.shader.setVector2("Size", [viewport.canvas.width, viewport.canvas.height]);
    }
}
</script>

<template>
    <div class="container">
        <div class="viewer">
            <canvas ref="canvas" v-resize="canvasResize"></canvas>
            <div class="py-3 text-medium-emphasis">Input</div>
            <PropertyEditor @property:update="updateProperty" @property:delete="deleteProperty" />
        </div>
        <div class="editor">
            <transition name="scale">
                <div v-if="state.error.message" class="error">{{ state.error.message }}</div>
            </transition>

            <v-tabs class="tabs" size="small" v-model="state.tab" @update:model-value="tabChange">
                <v-tab size="small" class="pl-10 pr-5" value="fragment" prepend-icon="mdi-grid-large">Fragment</v-tab>
                <v-tab size="small" class="pl-10 pr-5" value="vertex" prepend-icon="mdi-vector-triangle">Vertex</v-tab>
                <div class="top-controls mx-1">
                    <v-btn v-if="false" size="small" variant="plain" icon="mdi-plus"></v-btn>
                </div>
            </v-tabs>
            <CodeEditor v-model="state.code" class="code-editor" @update:model-value="updateCode" :error="state.error"
                @init="editor => aceEditor = editor" />
            <div class="controls">
                <v-btn size="small" @click="compile" color="primary">Compile</v-btn>
            </div>
        </div>
    </div>
</template>

<style>
.top-controls {
    display: flex;
    align-items: center;
}

.tabs {
    background-color: #141414;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.controls {
    background-color: #141414;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: .5em;
}

.container {
    display: flex;
    height: 100%;
    padding: 1em;
}

.viewer {
    position: relative;
    flex: 1;
    display: flex;
    flex-flow: column;
    max-height: calc(100vh - 64px - 2em);
}

canvas {
    width: 100%;
    border-radius: 4px;
}

.editor {
    position: relative;
    flex: 1;
    display: flex;
    flex-flow: column;
    padding-left: 1em;
}

.error {
    position: absolute;
    bottom: 5em;
    padding: 1em;
    z-index: 5;
    background-color: #e31b1b40;
    box-sizing: border-box;
    right: 2em;
    left: 6.5em;
    border-radius: 5px;
    color: #ec8383;
    font-size: 14px;
}

.code-editor {
    flex: 1;
}

.property-editor {
    flex: 1;
    overflow-y: auto;
}
</style>
