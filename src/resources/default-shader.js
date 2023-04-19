export const defaultShader = {
    fragment: `#version 300 es

precision mediump float;

uniform vec2 Size;
uniform float Time;

in vec2 Uv;

uniform vec4 BoxColor;
uniform float BoxScale;
uniform vec2 BoxSize;
uniform vec4 BoxCornerRadius;
uniform sampler2D SomeTexture;

out vec4 FragColor;

float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

void main() {
    float aspect = Size.x / Size.y;
    vec2 offset = vec2(1.0, 1.0) - BoxSize * BoxScale * 0.5;
    
    vec2 pos = Uv;
    pos.x *= aspect;
    float sdBox = sdRoundedBox(pos - vec2(0.5 * aspect, 0.5), BoxSize * BoxScale, BoxCornerRadius * 0.1);
    float box = 1.0 - smoothstep(0.0, fwidth(sdBox), sdBox);
    
    vec4 background = vec4(Uv.x, Uv.y, 0.0, 1.0);
    
    FragColor = mix(background, mix(background, BoxColor, BoxColor.a), box);
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