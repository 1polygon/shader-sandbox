<script setup>
import { VAceEditor } from "vue3-ace-editor";
import { ref, watch } from "vue";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-chaos";
import { Range } from "ace-builds";

import modeGlslUrl from "ace-builds/src-noconflict/mode-glsl?url";
ace.config.setModuleUrl("ace/mode/glsl", modeGlslUrl);

let aceEditor = null;
let errorMarker = null;
const aceRef = ref();

const emit = defineEmits(["update:modelValue", "init"]);
const props = defineProps(["modelValue", "error"]);

function change(e) {
    emit("update:modelValue", aceRef.value._editor.getValue());
}

function init(editor) {
    aceEditor = editor;
    emit("init", editor);
}

watch(props.error, (newError, oldError) => {
    if (errorMarker) {
        aceEditor.session.removeMarker(errorMarker);
        errorMarker = null;
    }
    if (newError.line != -1) {
        errorMarker = aceEditor.session.addMarker(new Range(newError.line - 1, 0, newError.line - 1, 10), "line-error", "fullLine");
    }
});
</script>

<template>
    <v-ace-editor ref="aceRef" class="code-editor" v-model:value="props.modelValue" @change="change" @init="init"
        lang="glsl" theme="chaos" :print-margin="false" :options="{
            useWorker: true,
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            fontSize: 16
        }" />
</template>

<style scoped>

</style>
<style>
.ace_gutter {
    border-right: none !important;
}

.line-error {
    position: absolute;
    background-color: #e31b1b40;
}
</style>