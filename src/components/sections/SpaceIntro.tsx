import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ponytail: single component, no abstractions, no config object
interface SpaceIntroProps {
  onHeroStart: () => void;
  onComplete: () => void;
}

const SpaceIntro = React.memo(function SpaceIntro({ onHeroStart, onComplete }: SpaceIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onHeroStartRef = useRef(onHeroStart);
  const onCompleteRef = useRef(onComplete);
  const hasWarpedRef = useRef(false);

  useEffect(() => { onHeroStartRef.current = onHeroStart; }, [onHeroStart]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Lock scroll position on mount & hide scrollbar during jupiter 1
  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // Unlock after a short delay to allow scroll-driven animation
    const t = setTimeout(() => {
      document.body.style.overflow = "";
    }, 800);

    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove("no-scrollbar");
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // --- SCENE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.set(0, 10, 24);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- TEXTURES ---
    const textureLoader = new THREE.TextureLoader();
    const jupiterTexture = textureLoader.load("/textures/jupiter.jpg");
    jupiterTexture.colorSpace = THREE.SRGBColorSpace;

    // --- HELPERS ---
    function createStarTexture() {
      const c = document.createElement("canvas");
      c.width = 16; c.height = 16;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.2, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(c);
    }

    // --- STARFIELD ---
    const starfieldGeo = new THREE.BufferGeometry();
    const starCount = 3500;
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 60 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i + 2] = r * Math.cos(phi);
      const isColored = Math.random() > 0.8;
      starCol[i] = isColored ? 0.7 + Math.random() * 0.3 : 1.0;
      starCol[i + 1] = isColored ? 0.8 + Math.random() * 0.2 : 1.0;
      starCol[i + 2] = isColored ? 0.9 + Math.random() * 0.1 : 1.0;
    }
    starfieldGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starfieldGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    const starTex = createStarTexture();
    const starfield = new THREE.Points(starfieldGeo, new THREE.PointsMaterial({
      size: 0.1, map: starTex, vertexColors: true, transparent: true, opacity: 0.6,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    scene.add(starfield);

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight(0x0e172e, 0.75));
    const sunLight = new THREE.DirectionalLight(0xfffdf2, 3.2);
    sunLight.position.set(22, 6, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // --- SPACE DUST ---
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 2000;
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    const dustPalette = [new THREE.Color(0x3a7bd5), new THREE.Color(0x9a4eff), new THREE.Color(0xffbf80)];
    for (let i = 0; i < dustCount * 3; i += 3) {
      const r = 6 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);
      dustPos[i] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPos[i + 2] = r * Math.cos(phi);
      const col = dustPalette[Math.floor(Math.random() * dustPalette.length)];
      dustCol[i] = col.r; dustCol[i + 1] = col.g; dustCol[i + 2] = col.b;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustCol, 3));
    const spaceDust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: 0.12, map: starTex, vertexColors: true, transparent: true, opacity: 0.8,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    scene.add(spaceDust);

    // --- WARP LINES ---
    const warpLinesCount = 250;
    const warpLinesGeo = new THREE.BufferGeometry();
    const warpLineData: { x: number; y: number; zStart: number; length: number; speed: number }[] = [];
    for (let i = 0; i < warpLinesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.6 + Math.random() * 6.5;
      warpLineData.push({
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius,
        zStart: (Math.random() - 0.5) * 40,
        length: 5 + Math.random() * 10,
        speed: 0.2 + Math.random() * 0.4,
      });
    }
    function updateWarpGeometry() {
      const arr: number[] = [];
      for (const line of warpLineData) {
        arr.push(line.x, line.y, line.zStart);
        arr.push(line.x, line.y, line.zStart + line.length);
      }
      warpLinesGeo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    }
    updateWarpGeometry();
    const warpLinesMat = new THREE.LineBasicMaterial({
      color: 0x82b3ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
    });
    const warpLines = new THREE.LineSegments(warpLinesGeo, warpLinesMat);
    warpLines.visible = false;
    scene.add(warpLines);

    // --- JUPITER ---
    const jupiter = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 128, 128),
      new THREE.MeshStandardMaterial({ map: jupiterTexture, roughness: 0.8, metalness: 0.05 })
    );
    jupiter.receiveShadow = true;
    scene.add(jupiter);

    // Atmosphere glow shader
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: { uSunPosition: { value: sunLight.position } },
      vertexShader: `
        varying vec3 vNormal; varying vec3 vViewPosition; varying vec3 vWorldNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vViewPosition = vec3(modelViewMatrix * vec4(position, 1.0));
          vWorldNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
          gl_Position = projectionMatrix * vec4(vViewPosition, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vNormal; varying vec3 vViewPosition; varying vec3 vWorldNormal;
        uniform vec3 uSunPosition;
        void main() {
          vec3 viewDir = normalize(-vViewPosition);
          float intensity = pow(0.75 - dot(vNormal, viewDir), 2.8);
          vec3 sunDir = normalize(uSunPosition);
          float sunDot = dot(vWorldNormal, sunDir);
          float litIntensity = smoothstep(-0.25, 0.25, sunDot);
          gl_FragColor = vec4(0.85, 0.70, 0.55, 1.0) * intensity * litIntensity;
        }`,
      blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true,
    });
    const jupiterAtmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.32, 64, 64), atmosphereMat);
    scene.add(jupiterAtmosphere);

    // --- RINGS ---
    const ringGeo = new THREE.RingGeometry(3.2, 5.0, 128);
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      uv.setXY(i, (v3.length() - 3.2) / 1.8, 0);
    }
    const ringMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec2 vUv; void main() {
        float alpha = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
        float subBands = sin(vUv.x * 60.0) * 0.15 + 0.85;
        gl_FragColor = vec4(0.8, 0.75, 0.7, 0.22) * alpha * subBands;
      }`,
      transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    const jupiterRing = new THREE.Mesh(ringGeo, ringMat);
    jupiterRing.rotation.x = Math.PI * 0.47;
    jupiterRing.rotation.y = Math.PI * 0.03;
    scene.add(jupiterRing);

    // --- MOONS ---
    function createProceduralTexture(baseColor: string, details: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w = 512, h = 256) {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, w, h);
      details(ctx, w, h);
      return new THREE.CanvasTexture(c);
    }

    // Metis
    const metisGeo = new THREE.DodecahedronGeometry(0.06, 1);
    const metisPos = metisGeo.attributes.position;
    for (let i = 0; i < metisPos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(metisPos, i);
      v.x *= 1.5; v.z *= 0.85;
      v.multiplyScalar(1 + (Math.random() - 0.5) * 0.25);
      metisPos.setXYZ(i, v.x, v.y, v.z);
    }
    metisGeo.computeVertexNormals();
    const metis = new THREE.Mesh(metisGeo, new THREE.MeshStandardMaterial({
      map: createProceduralTexture("#3a2b25", (ctx, w, h) => {
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? "#2c1e19" : "#4f3c33";
          ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 8, 0, Math.PI * 2); ctx.fill();
        }
      }, 256, 128),
      roughness: 1.0, metalness: 0.0,
    }));
    metis.castShadow = true; metis.receiveShadow = true;
    scene.add(metis);

    // Io
    const io = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), new THREE.MeshStandardMaterial({
      map: createProceduralTexture("#dbb958", (ctx, w, h) => {
        for (let i = 0; i < 150; i++) {
          const x = Math.random() * w, y = Math.random() * h, r = 2 + Math.random() * 8;
          ctx.fillStyle = Math.random() > 0.6 ? "#541c0c" : "#736633";
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
          if (Math.random() > 0.7) { ctx.fillStyle = "#eb581e"; ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2); ctx.fill(); }
        }
      }),
      roughness: 0.9, metalness: 0.05,
    }));
    io.castShadow = true; io.receiveShadow = true;
    scene.add(io);

    // Europa
    const europa = new THREE.Mesh(new THREE.SphereGeometry(0.13, 32, 32), new THREE.MeshStandardMaterial({
      map: createProceduralTexture("#e8e4db", (ctx, w, h) => {
        for (let i = 0; i < 80; i++) {
          ctx.fillStyle = "rgba(107,83,73,0.15)";
          ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 5 + Math.random() * 15, 0, Math.PI * 2); ctx.fill();
        }
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 40; i++) {
          ctx.strokeStyle = Math.random() > 0.5 ? "rgba(112,74,58,0.5)" : "rgba(150,116,98,0.3)";
          ctx.beginPath();
          let cx = Math.random() * w, cy = Math.random() * h;
          ctx.moveTo(cx, cy);
          for (let j = 0; j < 3; j++) { cx += (Math.random() - 0.5) * 30; cy += (Math.random() - 0.5) * 20; ctx.lineTo(cx, cy); }
          ctx.stroke();
        }
      }),
      roughness: 0.75, metalness: 0.1,
    }));
    europa.castShadow = true; europa.receiveShadow = true;
    scene.add(europa);

    // Ganymede
    const ganymede = new THREE.Mesh(new THREE.SphereGeometry(0.20, 32, 32), new THREE.MeshStandardMaterial({
      map: createProceduralTexture("#8f8c85", (ctx, w, h) => {
        for (let i = 0; i < 15; i++) {
          ctx.fillStyle = "#615f5a";
          ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 20 + Math.random() * 40, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 2;
        for (let i = 0; i < 30; i++) {
          ctx.beginPath();
          const yS = Math.random() * h;
          ctx.moveTo(0, yS); ctx.bezierCurveTo(128, yS + 20, 384, yS - 20, 512, yS + 50); ctx.stroke();
        }
        for (let i = 0; i < 40; i++) {
          const cx = Math.random() * w, cy = Math.random() * h, r = 2 + Math.random() * 6;
          ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 0.8;
          for (let k = 0; k < 8; k++) {
            const angle = (k / 8) * Math.PI * 2;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * r * 4, cy + Math.sin(angle) * r * 4); ctx.stroke();
          }
          ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        }
      }),
      roughness: 0.8, metalness: 0.05,
    }));
    ganymede.castShadow = true; ganymede.receiveShadow = true;
    scene.add(ganymede);

    // Callisto
    const callisto = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), new THREE.MeshStandardMaterial({
      map: createProceduralTexture("#5c5954", (ctx, w, h) => {
        for (let i = 0; i < 100; i++) {
          ctx.fillStyle = "rgba(56,53,49,0.4)";
          ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 10 + Math.random() * 20, 0, Math.PI * 2); ctx.fill();
        }
        for (let i = 0; i < 250; i++) {
          ctx.fillStyle = Math.random() > 0.8 ? "#ffffff" : "#d6d3cc";
          ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
        }
      }),
      roughness: 0.85, metalness: 0.05,
    }));
    callisto.castShadow = true; callisto.receiveShadow = true;
    scene.add(callisto);

    // --- ORBIT LINES ---
    const orbitRadii = { metis: 3.3, io: 4.2, europa: 5.6, ganymede: 7.4, callisto: 9.4 };
    function createOrbitLine(radius: number, incX: number, incZ: number) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const t = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
      }
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
      );
      line.rotation.x = incX;
      line.rotation.z = incZ;
      return line;
    }
    scene.add(createOrbitLine(orbitRadii.metis, 0.02, 0.0));
    scene.add(createOrbitLine(orbitRadii.io, 0.05, 0.0));
    scene.add(createOrbitLine(orbitRadii.europa, -0.04, 0.02));
    scene.add(createOrbitLine(orbitRadii.ganymede, 0.03, -0.01));
    scene.add(createOrbitLine(orbitRadii.callisto, -0.06, 0.04));

    // --- SCROLL-DRIVEN CAMERA TIMELINE ---
    const scrollWrapper = container.querySelector("#space-scroll-wrapper") as HTMLElement;
    const spaceTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollWrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          // Auto-trigger warp at 95% scroll
          if (self.progress >= 0.95 && !hasWarpedRef.current) {
            hasWarpedRef.current = true;
            triggerWarp();
          }
        },
      },
    });

    // Phase 1: Deep space → intermediate
    spaceTimeline.to(camera.position, { x: -3.0, y: 4.2, z: 13.0, ease: "none" }, 0);
    // Phase 2: Intermediate → close flyby
    spaceTimeline.to(camera.position, { x: 2.8, y: -0.5, z: 4.8, ease: "none" }, 0.5);

    // Notify parent that hero can start prepping (parallels the old IntroLoader behavior)
    setTimeout(() => { onHeroStartRef.current(); }, 1000);

    // --- WARP EFFECT ---
    let isWarping = false;
    const warpState = { shake: 0, speed: 0 };

    function triggerWarp() {
      if (isWarping) return;
      isWarping = true;
      document.body.style.overflowY = "hidden";

      // Show fade overlay
      const fadeOverlay = container.querySelector("#space-warp-overlay") as HTMLElement;
      if (fadeOverlay) { fadeOverlay.style.opacity = "0"; fadeOverlay.style.display = "block"; }

      warpLines.visible = true;
      warpLinesMat.opacity = 0;

      const startX = camera.position.x;
      const startY = camera.position.y;
      const startZ = camera.position.z;

      const currentDist = Math.sqrt(startX * startX + startY * startY + startZ * startZ);
      const targetDist = Math.max(2.4, currentDist * 0.4);
      const dir = new THREE.Vector3(startX, startY, startZ).normalize();
      const finalX = dir.x * targetDist;
      const finalY = dir.y * targetDist;
      const finalZ = dir.z * targetDist;

      const warpTl = gsap.timeline();

      // Phase 1: Takeoff vibration (0–0.8s)
      warpTl.to(warpState, { shake: 0.08, duration: 0.8, ease: "power1.in" }, 0);
      warpTl.to(warpLinesMat, { opacity: 0.6, duration: 0.8, ease: "power1.inOut" }, 0);
      warpTl.to(warpState, { speed: 0.4, duration: 0.8, ease: "power1.in" }, 0);
      warpTl.to(camera.position, { x: startX * 0.9, y: startY * 0.9, z: startZ - 1.2, duration: 0.8, ease: "power1.inOut" }, 0);

      // Phase 2: Hyperdrive (0.8–2.2s)
      warpTl.to(warpState, { speed: 3.2, duration: 1.4, ease: "power2.in" }, 0.8);
      warpTl.to(warpState, { shake: 0.02, duration: 1.4, ease: "power2.out" }, 0.8);
      warpTl.to(warpLinesMat, { opacity: 0.95, duration: 0.6, ease: "power1.out" }, 0.8);
      warpTl.to(camera, { fov: 135, duration: 1.4, ease: "power3.in", onUpdate: () => camera.updateProjectionMatrix() }, 0.8);
      warpTl.to(camera.position, { x: finalX, y: finalY, z: finalZ, duration: 1.4, ease: "power4.in" }, 0.8);

      // Phase 3: Fade to black
      if (fadeOverlay) {
        warpTl.to(fadeOverlay, { opacity: 1, duration: 0.25, ease: "none" }, 1.95);
      }

      // Complete: notify parent
      warpTl.add(() => {
        isWarping = false;
        document.body.style.overflow = "";
        // Small delay for the black to feel seamless
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }, 2.5);
    }

    // --- RENDER LOOP ---
    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime() * 1000;

      // Jupiter rotation
      jupiter.rotation.y = elapsed * 0.0001;
      jupiterAtmosphere.rotation.y = elapsed * 0.0001;

      // Moon orbits (Laplace resonances)
      const angleMetis = elapsed * 0.0008;
      metis.position.set(
        Math.cos(angleMetis) * orbitRadii.metis,
        Math.sin(angleMetis * 0.5) * 0.05,
        Math.sin(angleMetis) * orbitRadii.metis
      );
      metis.rotation.x += 0.01; metis.rotation.y += 0.015;

      const angleIo = elapsed * 0.0005;
      io.position.set(
        Math.cos(angleIo) * orbitRadii.io,
        Math.sin(angleIo * 0.2) * 0.15,
        Math.sin(angleIo) * orbitRadii.io
      );
      io.rotation.y = -angleIo + Math.PI;
      io.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.05);

      const angleEuropa = elapsed * 0.00025 + Math.PI * 0.4;
      europa.position.set(
        Math.cos(angleEuropa) * orbitRadii.europa,
        Math.cos(angleEuropa * 0.15) * 0.2,
        Math.sin(angleEuropa) * orbitRadii.europa
      );
      europa.rotation.y = -angleEuropa + Math.PI;
      europa.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.04);
      europa.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.02);

      const angleGanymede = elapsed * 0.000125 + Math.PI * 0.8;
      ganymede.position.set(
        Math.cos(angleGanymede) * orbitRadii.ganymede,
        Math.sin(angleGanymede * 0.1) * 0.1,
        Math.sin(angleGanymede) * orbitRadii.ganymede
      );
      ganymede.rotation.y = -angleGanymede + Math.PI;
      ganymede.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.03);
      ganymede.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.01);

      const angleCallisto = elapsed * 0.000055 + Math.PI * 1.3;
      callisto.position.set(
        Math.cos(angleCallisto) * orbitRadii.callisto,
        Math.cos(angleCallisto * 0.08) * 0.25,
        Math.sin(angleCallisto) * orbitRadii.callisto
      );
      callisto.rotation.y = -angleCallisto + Math.PI;
      callisto.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -0.06);
      callisto.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.04);

      // Background rotation
      starfield.rotation.y = elapsed * 0.000003;
      spaceDust.rotation.y = elapsed * 0.00001;

      // Warp tunnel
      if (isWarping) {
        for (const line of warpLineData) {
          line.zStart -= line.speed * warpState.speed * 8.0;
          if (line.zStart < -45) line.zStart = 45;
        }
        updateWarpGeometry();
        warpLinesGeo.attributes.position.needsUpdate = true;
        warpLines.rotation.z += 0.012 * warpState.speed;
      }

      // Camera look-at
      camera.lookAt(new THREE.Vector3(0, -camera.position.y * 0.12, 0));

      // Shake
      if (isWarping && warpState.shake > 0) {
        camera.position.x += (Math.random() - 0.5) * warpState.shake;
        camera.position.y += (Math.random() - 0.5) * warpState.shake;
        camera.position.z += (Math.random() - 0.5) * warpState.shake;
      }

      renderer.render(scene, camera);
    }

    animate();

    // --- RESIZE ---
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);

      // Kill all ScrollTriggers created by this component
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === scrollWrapper || st.vars.trigger === scrollWrapper) {
          st.kill();
        }
      });
      spaceTimeline.kill();

      // Dispose Three.js resources
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineLoop || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ zIndex: 9999 }}>
      {/* Fixed black backdrop — covers everything behind the canvas */}
      <div className="fixed inset-0" style={{ backgroundColor: "#020202", zIndex: 9998 }} />

      {/* WebGL Canvas — fixed so it stays in view during scroll */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 9999 }} />

      {/* Scroll spacer — in normal flow, creates 4vh of scrollable space */}
      <div id="space-scroll-wrapper" className="relative w-full pointer-events-none" style={{ zIndex: 10000 }}>
        <div style={{ height: "100vh" }} />
        <div style={{ height: "100vh" }} />
        <div style={{ height: "100vh" }} />
        <div style={{ height: "100vh" }} />
      </div>

      {/* Warp fade overlay */}
      <div
        id="space-warp-overlay"
        className="fixed inset-0 pointer-events-none"
        style={{ backgroundColor: "black", zIndex: 10001, opacity: 0, display: "none" }}
      />

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none animate-pulse" style={{ zIndex: 10000 }}>
        <div className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
        </div>
        <span className="text-white/40 text-[11px] font-medium tracking-[0.2em] uppercase">Scroll to descend</span>
      </div>
    </div>
  );
});

export default SpaceIntro;
