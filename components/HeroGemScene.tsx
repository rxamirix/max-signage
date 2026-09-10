"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ROOF_PTS: [number, number][] = [
  [-0.9535, 0.3662],
  [-0.9535, -0.7113],
  [0.01, -0.1056],
  [0.9535, -0.7183],
  [0.9535, 0.3521],
  [0.01, 0.9507],
];

const DROP_PTS: [number, number][] = [
  [-0.3289, -0.331],
  [-0.3289, -0.7394],
  [0.0033, -0.9507],
  [0.3289, -0.7465],
  [0.3289, -0.331],
  [0.01, -0.5352],
  [-0.01, -0.5352],
];

const GEM_SCALE = 1.22;
const BRAND_YELLOW = 0xeaea35;
const BRAND_YELLOW_DARK = 0xcfcf17;
const BRAND_NAVY = 0x2d3192;
const BRAND_NAVY_LIGHT = 0x8f95e0;
const SCENE_BG = 0x050505;

function buildShape(points: [number, number][], scale: number) {
  const shape = new THREE.Shape();
  points.forEach((point, index) => {
    const x = point[0] * scale;
    const y = point[1] * scale;
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function glowTexture(rgb: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, `${rgb},0.5)`);
  gradient.addColorStop(0.5, `${rgb},0.14)`);
  gradient.addColorStop(1, `${rgb},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(canvas);
}

function dotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(254,255,249,1)");
  gradient.addColorStop(1, "rgba(234,234,53,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function easeOutBack(x: number) {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function disposeMaterial(material: THREE.Material) {
  const textured = material as THREE.MeshBasicMaterial;
  textured.map?.dispose();
  material.dispose();
}

export function HeroGemScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE_BG);
    scene.fog = new THREE.FogExp2(SCENE_BG, 0.012);

    const lookY = 0.78;
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(-0.35, 1.15, 5.15);
    camera.lookAt(1.1, lookY, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(SCENE_BG, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    const hemi = new THREE.HemisphereLight(BRAND_NAVY_LIGHT, BRAND_NAVY, 1.15);
    scene.add(hemi);

    const key = new THREE.SpotLight(0xffffff, 16, 28, Math.PI / 5.2, 0.32, 1.15);
    key.position.set(3.2, 6.1, 5.2);
    key.target.position.set(1.7, 1.55, 0);
    scene.add(key, key.target);

    const rim = new THREE.PointLight(BRAND_NAVY, 5.4, 18, 2);
    rim.position.set(-3.4, 2.6, -3.4);
    scene.add(rim);

    const fill = new THREE.PointLight(BRAND_YELLOW, 4.2, 14, 2);
    fill.position.set(-1.5, 0.2, 4);
    scene.add(fill);

    const topGlint = new THREE.PointLight(0xffffff, 3.4, 12, 2);
    topGlint.position.set(0.4, 4.8, 2.6);
    scene.add(topGlint);

    const gemLight = new THREE.PointLight(BRAND_YELLOW, 3.8, 8, 2);
    gemLight.position.set(0, 0.2, 1.4);

    const gemMat = new THREE.MeshStandardMaterial({
      color: BRAND_YELLOW,
      metalness: 0.55,
      roughness: 0.1,
      emissive: BRAND_YELLOW,
      emissiveIntensity: 0.72,
    });
    const gemMatDark = new THREE.MeshStandardMaterial({
      color: BRAND_YELLOW_DARK,
      metalness: 0.6,
      roughness: 0.12,
      emissive: BRAND_YELLOW_DARK,
      emissiveIntensity: 0.58,
    });

    const extrudeSettings = {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.048,
      bevelSegments: 6,
      curveSegments: 3,
    };

    const roofGeo = new THREE.ExtrudeGeometry(
      buildShape(ROOF_PTS, GEM_SCALE),
      extrudeSettings,
    );
    roofGeo.center();
    const roofMesh = new THREE.Mesh(roofGeo, gemMat);

    const dropGeo = new THREE.ExtrudeGeometry(buildShape(DROP_PTS, GEM_SCALE), {
      ...extrudeSettings,
      depth: 0.36,
    });
    const dropMesh = new THREE.Mesh(dropGeo, gemMatDark);

    const tmpRoof = new THREE.ExtrudeGeometry(
      buildShape(ROOF_PTS, GEM_SCALE),
      extrudeSettings,
    );
    tmpRoof.computeBoundingBox();
    const bb = tmpRoof.boundingBox!;
    const cx = (bb.max.x + bb.min.x) / 2;
    const cy = (bb.max.y + bb.min.y) / 2;
    dropMesh.position.set(-cx, -cy, 0.02);
    tmpRoof.dispose();

    const gemGroup = new THREE.Group();
    gemGroup.add(roofMesh);
    gemGroup.add(dropMesh);
    gemGroup.rotation.set(-0.14, 0.22, 0);

    const gemAnchor = new THREE.Group();
    gemAnchor.position.set(1.7, 1.05, 0);
    gemAnchor.add(gemGroup);
    gemAnchor.add(gemLight);
    scene.add(gemAnchor);

    const dropRestPos = dropMesh.position.clone();

    const floorGlowMap = glowTexture("rgba(234,234,53");
    const floorGlowMat = new THREE.MeshBasicMaterial({
      map: floorGlowMap,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    });
    const floorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      floorGlowMat,
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.set(1.7, -1.55, 0);
    scene.add(floorGlow);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({
        color: 0x030303,
        roughness: 0.35,
        metalness: 0.6,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.57;
    scene.add(floor);

    const count = 260;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 1] = Math.random() * 7 - 2.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.08 + Math.random() * 0.22;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMap = dotTexture();
    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      map: particleMap,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    roofMesh.position.set(-1.4, 1.5, -1.8);
    roofMesh.rotation.set(0.6, 1.1, 0.4);
    roofMesh.scale.setScalar(0.001);
    dropMesh.position.set(
      dropRestPos.x + 1.7,
      dropRestPos.y - 2.0,
      dropRestPos.z + 2.0,
    );
    dropMesh.rotation.set(-0.7, -0.9, 0.5);
    dropMesh.scale.setScalar(0.001);

    const t0 = performance.now();
    let introActive = true;
    let assembleDone = false;
    let mx = 0;
    let my = 0;
    let curX = -0.14;
    let curY = 0.22;
    let raf = 0;
    let disposed = false;
    let visible = true;

    const frameCamera = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      const aspect = w / h;
      const gemX = aspect > 1.15 ? 1.85 : aspect > 0.85 ? 1.25 : 0.7;
      gemAnchor.position.x = gemX;
      floorGlow.position.x = gemX;
      key.target.position.set(gemX, 1.55, 0);
      camera.aspect = aspect;
      camera.position.z = aspect < 0.85 ? 6.6 : aspect < 1.15 ? 5.45 : 4.95;
      camera.lookAt(gemX * 0.58, lookY, 0);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
    };

    const runIntro = (now: number) => {
      const elapsed = now - t0;
      const scaleT = clamp01((elapsed - 100) / 900);
      const moveT = clamp01((elapsed - 100) / 1300);
      const se = reduceMotion ? 1 : easeOutBack(scaleT);
      const me = reduceMotion ? 1 : easeOutCubic(moveT);

      roofMesh.scale.setScalar(lerp(0.001, 1, se));
      dropMesh.scale.setScalar(lerp(0.001, 1, se));

      roofMesh.position.set(lerp(-1.4, 0, me), lerp(1.5, 0, me), lerp(-1.8, 0, me));
      roofMesh.rotation.set(lerp(0.6, 0, me), lerp(1.1, 0, me), lerp(0.4, 0, me));

      dropMesh.position.set(
        lerp(dropRestPos.x + 1.7, dropRestPos.x, me),
        lerp(dropRestPos.y - 2.0, dropRestPos.y, me),
        lerp(dropRestPos.z + 2.0, dropRestPos.z, me),
      );
      dropMesh.rotation.set(
        lerp(-0.7, 0, me),
        lerp(-0.9, 0, me),
        lerp(0.5, 0, me),
      );

      const lightT = clamp01((elapsed - 200) / 900);
      hemi.intensity = lerp(0.12, 1.15, lightT);
      key.intensity = lerp(0, 16, lightT);
      rim.intensity = lerp(0, 5.4, lightT);
      fill.intensity = lerp(0, 4.2, lightT);
      topGlint.intensity = lerp(0, 3.4, lightT);
      gemLight.intensity = lerp(0, 3.8, lightT);
      floorGlowMat.opacity = lerp(0, 1, lightT);
      pMat.opacity = lerp(0, 0.7, clamp01((elapsed - 500) / 900));

      if (moveT >= 1 && !assembleDone) assembleDone = true;

      return scaleT < 1 || moveT < 1 || lightT < 1;
    };

    const restRotX = -0.14;
    const restRotY = 0.22;

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      mx = (event.clientX - rect.left) / rect.width - 0.5;
      my = (event.clientY - rect.top) / rect.height - 0.5;
    };

    const animate = (now: number) => {
      if (disposed) return;
      if (!visible && !introActive) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(animate);

      if (introActive) {
        introActive = runIntro(now);
      }

      if (!reduceMotion) {
        const targetY = restRotY + mx * 1.15;
        const targetX = restRotX + my * 0.75;
        curX += (targetX - curX) * 0.08;
        curY += (targetY - curY) * 0.08;
        gemGroup.rotation.x = curX;
        gemGroup.rotation.y = curY;
      }

      if (!reduceMotion || introActive) {
        const arr = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i += 1) {
          arr[i * 3 + 1] += speeds[i] * 0.007;
          if (arr[i * 3 + 1] > 4.6) arr[i * 3 + 1] = -2.2;
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    if (reduceMotion) {
      roofMesh.scale.setScalar(1);
      dropMesh.scale.setScalar(1);
      roofMesh.position.set(0, 0, 0);
      roofMesh.rotation.set(0, 0, 0);
      dropMesh.position.copy(dropRestPos);
      dropMesh.rotation.set(0, 0, 0);
      hemi.intensity = 1.15;
      key.intensity = 16;
      rim.intensity = 5.4;
      fill.intensity = 4.2;
      topGlint.intensity = 3.4;
      gemLight.intensity = 3.8;
      floorGlowMat.opacity = 1;
      pMat.opacity = 0.7;
      introActive = false;
    }

    frameCamera();
    const resizeObserver = new ResizeObserver(frameCamera);
    resizeObserver.observe(wrap);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && raf === 0 && !disposed) {
          raf = requestAnimationFrame(animate);
        }
      },
      { rootMargin: "80px 0px" },
    );
    visibilityObserver.observe(wrap);
    window.addEventListener("resize", frameCamera);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", frameCamera);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      scene.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach(disposeMaterial);
        }
      });
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-pan-y"
      />
    </div>
  );
}
