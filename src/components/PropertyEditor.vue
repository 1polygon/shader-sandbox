<script setup>
import { onMounted, reactive } from "vue";

const emit = defineEmits(["property:update", "property:delete"]);
const state = reactive({
    colorPicker: {
        property: null,
        value: { r: 255, g: 0, b: 255, a: 1 }
    },
    list: [
        {
            type: "color",
            key: "BoxColor",
            value: [0.13, 0.12, 0.16, 1.0]
        },
        {
            type: "float",
            key: "BoxScale",
            value: 1.0,
            range: {
                min: 0.0,
                max: 1.0
            }
        },
        {
            type: "vec2",
            key: "BoxSize",
            value: [0.5, 0.3]
        },
        {
            type: "vec4",
            key: "BoxCornerRadius",
            value: [2.7, 0.3, 1.3, 2.3]
        },
        {
            type: "texture",
            key: "SomeTexture",
            value: {
                src: "",
                width: 0,
                height: 0
            }
        },
    ],
    dialog: {
        visible: false,
        edit: null,
        key: "NewProperty",
        types: ["float", "vec2", "vec3", "vec4", "texture"],
        type: "float",
        range: {
            enabled: false,
            min: 0.0,
            max: 1.0
        }
    }
});

onMounted(() => {
    for (const property of state.list) {
        emit("property:update", property);
    }
});

function updateColor(color) {
    state.colorPicker.property.value[0] = color.r / 255.0;
    state.colorPicker.property.value[1] = color.g / 255.0;
    state.colorPicker.property.value[2] = color.b / 255.0;
    state.colorPicker.property.value[3] = color.a;
    emit("property:update", state.colorPicker.property);
}

function showColorPicker(property) {
    state.colorPicker.value = {
        r: property.value[0] * 255.0,
        g: property.value[1] * 255.0,
        b: property.value[2] * 255.0,
        a: property.value[3]
    }
    state.colorPicker.property = property;
}

const defaultValues = {
    float: 0.0,
    vec2: [0.0, 0.0],
    vec3: [0.0, 0.0, 0.0],
    vec4: [0.0, 0.0, 0.0, 1.0],
    texture: {
        src: "",
        width: 0,
        height: 0,
    }
}

function submitProperty() {
    state.dialog.visible = false;
    let property = state.dialog.edit;
    if (!property) {
        // Create new property

        property = {
            key: state.dialog.key,
            type: state.dialog.type,
            value: { ...defaultValues[state.dialog.type] }
        };
        state.list.push(property);
    } else {
        // Update property

        if (property.key != state.dialog.key) {
            // Save previous key on rename to be later removed when updating uniforms
            property.prevKey = property.key;
        }

        property.key = state.dialog.key;

        if (property.type != state.dialog.type) {
            // Remove previously used texture
            if (property.type == "texture" && property.value.texture) {
                property.value.texture.destroy();
                property.value.texture = null;
            }
            if (property.range) {
                property.range = undefined;
            }
            property.type = state.dialog.type;
            property.value = { ...defaultValues[state.dialog.type] };
        }
        state.dialog.edit = null;
    }
    if (state.dialog.range.enabled) {
        property.range = {
            min: state.dialog.range.min,
            max: state.dialog.range.max
        }
    } else {
        property.range = undefined;
    }
    emit("property:update", property);
}

function showEditDialog(property) {
    state.dialog.edit = property;
    state.dialog.type = property.type;
    state.dialog.key = property.key;
    if (property.range) {
        state.dialog.range.enabled = true;
        state.dialog.range.min = property.range.min;
        state.dialog.range.max = property.range.max;
    }
    state.dialog.visible = true;
}

function showCreateDialog() {
    state.dialog.edit = null;
    state.dialog.range.enabled = false;
    state.dialog.range.min = 0.0;
    state.dialog.range.max = 1.0;
    state.dialog.visible = true;
}

function deleteProperty(property) {
    const index = state.list.indexOf(property);
    if (index != -1) {
        state.list.splice(index, 1);
    }
    emit("property:delete", property);
}

function setTexture(property, files) {
    if (files[0]) {
        const src = URL.createObjectURL(files[0]);
        property.value.src = src;
    } else {
        property.value.src = null;
        property.value.width = 0;
        property.value.height = 0;
    }
    emit("property:update", property);
}

function loadImage(property, image) {
    property.value.width = image.target.width;
    property.value.height = image.target.height;
}
</script>

<template>
    <v-dialog v-model="state.dialog.visible">
        <v-card class="dialog">
            <v-card-title>{{ state.dialog.edit ? "Edit property" : "Create property" }}</v-card-title>
            <v-card-text>
                <v-text-field label="Name" v-model="state.dialog.key" />
                <v-select label="Type" :items="state.dialog.types" v-model="state.dialog.type" />
                <template v-if="state.dialog.type == 'float'">
                    <v-checkbox label="Range" v-model="state.dialog.range.enabled" />
                    <div class="d-flex">
                        <v-text-field :disabled="!state.dialog.range.enabled" type="number" step="0.1" label="Min"
                            v-model="state.dialog.range.min" />
                        <v-text-field :disabled="!state.dialog.range.enabled" type="number" step="0.1" class="ml-5"
                            label="Max" v-model="state.dialog.range.max" />
                    </div>
                </template>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="state.dialog.visible = false">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="submitProperty">
                    {{ state.dialog.edit ? "Save" : "Create" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <div v-if="state.colorPicker.property" class="picker">
        <v-color-picker v-model="state.colorPicker.value" @update:model-value="updateColor" />
    </div>
    <div class="properties pt-1">
        <div v-for="prop in state.list">
            <div class="property">

                <!-- Color -->
                <template v-if="prop.type == 'color'">
                    <div class="key"><span>uniform vec4 </span>{{ prop.key }}</div>
                    <div class="value d-block">
                        <div class="color py-2 px-3" :class="{ active: state.colorPicker.property == prop }"
                            @click="state.colorPicker.property == prop ? state.colorPicker.property = null : showColorPicker(prop)"
                            :style="{ backgroundColor: ('rgba(' + prop.value[0] * 255.0 + ',' + prop.value[1] * 255.0 + ',' + prop.value[2] * 255.0 + ',' + prop.value[3] + ')') }">
                            {{ prop.value.map(val => val.toFixed(2)).join(", ") }}
                        </div>
                    </div>
                </template>

                <!-- Float -->
                <template v-else-if="prop.type == 'float'">
                    <div class="key"><span>uniform float </span>{{ prop.key }}</div>
                    <div class="value">
                        <v-slider v-if="prop.range" :min="prop.range.min" :max="prop.range.max" v-model="prop.value"
                            hide-details thumb-label @update:modelValue="emit('property:update', prop)" />
                        <v-text-field v-else density="compact" step="0.1" hide-details v-model="prop.value" type="number"
                            @update:modelValue="emit('property:update', prop)"></v-text-field>
                    </div>
                </template>

                <!-- Vector -->
                <template v-else-if="prop.type == 'vec2' || prop.type == 'vec3' || prop.type == 'vec4'">
                    <div class="key"><span>{{ "uniform " + prop.type + " " }}</span>{{ prop.key }}</div>
                    <div class="value">
                        <v-text-field v-for="(arrValue, index) in prop.value" density="compact" step="0.1" hide-details
                            v-model="prop.value[index]" type="number"
                            @update:modelValue="emit('property:update', prop)"></v-text-field>
                    </div>
                </template>

                <!-- Texture -->
                <template v-else-if="prop.type == 'texture'">
                    <div class="key"><span>uniform sampler2D </span>{{ prop.key }}</div>
                    <div class="value">
                        <div class="meta d-flex">
                            <v-file-input density="compact" class="align-self-center" prepend-icon="mdi-texture"
                                hide-details accept="image/*" label="Select image"
                                @update:modelValue="files => setTexture(prop, files)"></v-file-input>
                        </div>
                        <div class="texture">
                            <img :src="prop.value.src" @load="image => loadImage(prop, image)" />
                            <div class="size">{{ prop.value.width + "x" + prop.value.height }}</div>
                        </div>
                    </div>
                </template>

                <div class="ml-2 actions">
                    <v-btn icon="mdi-pencil" size="x-small" variant="plain" @click="showEditDialog(prop)"></v-btn>
                    <v-btn icon="mdi-close" color="error" size="x-small" variant="plain"
                        @click="deleteProperty(prop)"></v-btn>
                </div>
            </div>
        </div>
        <v-btn class="mt-5 align-self-center" icon="mdi-plus" @click="showCreateDialog"></v-btn>
    </div>
</template>

<style scoped>
.meta {
    flex: 1;
}

.dialog {
    width: 400px;
    align-self: center;
}

.actions {
    visibility: hidden;
}

.property:hover .actions {
    visibility: visible;
}

.properties {
    display: flex;
    flex-flow: column;
    gap: .5em;
    overflow-y: auto;
    padding-left: 2em;
    padding-right: 1em;
}

.property {
    display: flex;
    align-items: center;
}

.key {
    flex: 1;
}

.key>span {
    font-weight: bolder;
    color: #00698f;
    font-size: 14px;
}

.value {
    width: 340px;
    display: flex;
    gap: .5em;
}

.color {
    position: relative;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    text-shadow: 0 0 3px rgba(0, 0, 0, 1);
}

.color.active {
    outline: 2px solid #86682f;
}

.picker {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    margin-bottom: 1em;
}

.texture {
    position: relative;
    display: flex;
    height: 100px;
    width: 100px;
    justify-content: center;
    align-items: center;
}

.texture img {
    max-width: 100%;
    max-height: 100%;
}

.size {
    position: absolute;
    bottom: 0;
    text-shadow: 0 0 2px rgba(0, 0, 0, 1);
    font-size: 12px;
    color: gray;
}
</style>