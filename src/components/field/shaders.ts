/** Point-field shaders. Morphing happens on the GPU; the CPU never loops over points per frame. */

export const vertexShader = /* glsl */ `
  attribute vec3 aTo;
  attribute float aToneFrom;
  attribute float aToneTo;
  attribute float aSeed;

  uniform float uMix;
  uniform float uTime;
  uniform float uNoise;
  uniform float uSize;
  uniform float uPixelRatio;

  varying float vTone;
  varying float vDepth;
  varying float vY;

  vec3 drift(vec3 p, float s) {
    return vec3(
      sin(uTime * 0.6 + s * 6.2831 + p.y * 2.1),
      cos(uTime * 0.5 + s * 12.9 + p.x * 1.7),
      sin(uTime * 0.4 + s * 4.1 + p.z * 2.3)
    );
  }

  void main() {
    // Per-point stagger so a morph reads as a stream, not a cross-fade.
    float k = clamp(uMix * 1.4 - aSeed * 0.4, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);

    vec3 p = mix(position, aTo, k);
    float mid = sin(k * 3.14159);
    p += drift(p, aSeed) * (uNoise * 0.03 + mid * 0.1);

    vTone = mix(aToneFrom, aToneTo, step(0.5, k));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vDepth = clamp((-mv.z - 3.6) / 3.2, 0.0, 1.0);
    float signal = vTone > 1.5 ? 1.35 : 1.0;
    gl_PointSize = uSize * uPixelRatio * (1.0 + (1.0 - vDepth) * 0.8) * signal;
    vY = gl_Position.y / gl_Position.w;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform vec3 uSignal;
  uniform vec3 uIce;
  uniform vec3 uSage;
  uniform float uDark;

  varying float vTone;
  varying float vDepth;
  varying float vY;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.32, d);

    // Matte "ink" points; distant points pick up the ice-to-sage scene light.
    vec3 ink = mix(uInk, uPaper, uDark);
    vec3 light = mix(uSage, uIce, clamp(vY * 0.5 + 0.5, 0.0, 1.0));
    vec3 col = mix(ink, mix(ink, light, 0.55), vDepth);
    float a = mix(0.88, 0.32, vDepth);

    if (vTone > 1.5) {
      col = uSignal;
      a = 0.95;
    } else if (vTone > 0.5) {
      a = 0.13;
    }
    gl_FragColor = vec4(col, a * edge);
  }
`;
