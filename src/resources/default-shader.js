export const defaultShader = {
    fragment: `#version 300 es

precision mediump float;

uniform vec2 Size;
uniform float Time;

in vec2 Uv;

out vec4 FragColor;

void main() {
    FragColor = vec4(Uv.x, Uv.y, 0.0, 1.0);
}`,
    vertex: `#version 300 es

layout(location = 0) in vec3 vPosition;
layout(location = 1) in vec3 vNormal;
layout(location = 2) in vec2 vUv;
layout(location = 4) in vec3 vTangent;

uniform mat4 Projection;
uniform mat4 Model;

out vec2 Uv;

void main() {
    Uv = vUv;
    gl_Position = vec4(vPosition, 1.0);
}`
}