import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function PlaneCanvas({ theme }) {
  const containerRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const materialRef = useRef(null);
  const lightsRef = useRef({});
  const lightRaysGroupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup - Perspective camera
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainKeyLight.position.set(6, 8, 6);
    scene.add(mainKeyLight);

    const violetRimLight = new THREE.DirectionalLight(0x8b5cf6, 4.8);
    violetRimLight.position.set(-6, -4, -2);
    scene.add(violetRimLight);

    const fillLight = new THREE.PointLight(0xa78bfa, 2.0, 25);
    fillLight.position.set(2, -4, 5);
    scene.add(fillLight);

    lightsRef.current = { ambientLight, mainKeyLight, violetRimLight, fillLight };

    // 5. Volumetric Light Rays Group coming from top-left (for Light Mode)
    const lightRaysGroup = new THREE.Group();
    const rayCount = 6;
    for (let i = 0; i < rayCount; i++) {
      const geometry = new THREE.CylinderGeometry(0.1 + i * 0.1, 1.2 + i * 0.4, 25, 16, 1, true);
      const material = new THREE.MeshBasicMaterial({
        color: 0xfffbeb,
        transparent: true,
        opacity: 0.08 - i * 0.01,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ray = new THREE.Mesh(geometry, material);
      ray.position.set(-8 + i * 1.5, 6, -2);
      ray.rotation.z = -Math.PI / 4 + (i * 0.05);
      lightRaysGroup.add(ray);
    }
    lightRaysGroup.visible = theme === 'light';
    scene.add(lightRaysGroup);
    lightRaysGroupRef.current = lightRaysGroup;

    // 6. Plane Container Node
    const planePivot = new THREE.Group();
    scene.add(planePivot);

    let planeModel = null;
    let mouseX = 0;
    let mouseY = 0;

    // Load GLTF Model
    const loader = new GLTFLoader();
    const modelPath = '/models/paper-plane.glb';

    const setupModel = (gltf) => {
      planeModel = gltf.scene;

      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.32,
        metalness: 0.08,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });
      materialRef.current = mat;

      planeModel.traverse((child) => {
        if (child.isMesh) {
          child.material = mat;
        }
      });

      const box = new THREE.Box3().setFromObject(planeModel);
      const center = box.getCenter(new THREE.Vector3());
      planeModel.position.sub(center);

      planeModel.scale.set(1.4, 1.4, 1.4);
      planePivot.add(planeModel);
      setModelLoaded(true);
    };

    loader.load(
      modelPath,
      (gltf) => setupModel(gltf),
      undefined,
      (err) => {
        console.warn('Trying fallback GLB path...', err);
        loader.load(
          '/models/paper_plane.glb',
          (gltf) => setupModel(gltf),
          undefined,
          (err2) => {
            console.error('Failed to load 3D paper plane model:', err2);
            setLoadError(true);
          }
        );
      }
    );

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initial load animation time counter + target vectors
    const startTime = performance.now();

    const targetPos = new THREE.Vector3();
    const targetRot = new THREE.Euler();
    const targetScale = new THREE.Vector3();

    const currentPos = new THREE.Vector3(3.8, 0.4, 2.2); // Starts off-screen RIGHT
    const currentRot = new THREE.Euler(-0.35, -0.85, 0.3);
    const currentScale = new THREE.Vector3(1.4, 1.4, 1.4);

    // STRICTLY HORIZONTAL / HORIZONTAL-DIAGONAL FLIGHT PATH (RIGHT -> LEFT ONLY):
    // Fully deterministic, reversible when scrolling UP back into Hero!
    const updateFlightPath = () => {
      const now = performance.now();
      const elapsedSec = (now - startTime) / 1000;

      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Hero scroll progress (0.0 to 1.0)
      const heroScrollProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1.2);

      // Visibility check & Reversible Return when scrolling back UP into Hero!
      if (heroScrollProgress >= 1.05) {
        setIsVisible(false);
        return;
      }

      if (!isVisible) {
        setIsVisible(true);
      }

      // Smooth opacity calculation: 1.0 in Hero, fades out cleanly as scroll exceeds 0.7
      const currentOpacity = heroScrollProgress < 0.6 
        ? 1.0 
        : Math.max(0, 1 - (heroScrollProgress - 0.6) / 0.45);
      
      setOpacity(currentOpacity);

      if (materialRef.current) {
        materialRef.current.opacity = currentOpacity;
      }

      // 1. Initial Page Load Intro Drift: Starts RIGHT (3.8) -> CENTER/RIGHT (1.8) over 3.2 seconds
      const initialIntroT = Math.min(1, elapsedSec / 3.2);
      const introX = THREE.MathUtils.lerp(3.8, 1.8, initialIntroT);

      // 2. Scroll-Driven Flight: RIGHT -> CENTER -> LEFT (Exits far LEFT: -6.5)
      // STRICTLY HORIZONTAL / DIAGONAL-HORIZONTAL TRAJECTORY
      targetPos.set(
        THREE.MathUtils.lerp(introX, -6.5, heroScrollProgress), // Pure R -> L horizontal flight
        THREE.MathUtils.lerp(0.3, -0.2, heroScrollProgress),  // Minimal vertical shift (no downward drop)
        THREE.MathUtils.lerp(2.2, -4.5, heroScrollProgress)   // Smooth depth retreat
      );

      // Subtle banking roll as plane flies horizontally left
      targetRot.set(
        THREE.MathUtils.lerp(-0.35, -0.15, heroScrollProgress),
        THREE.MathUtils.lerp(-0.85, -0.25, heroScrollProgress),
        THREE.MathUtils.lerp(0.3, 0.45, heroScrollProgress)  // Left wing roll
      );

      targetScale.setScalar(THREE.MathUtils.lerp(1.4, 0.5, heroScrollProgress));
    };

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      updateFlightPath();

      if (!isVisible) return;

      currentPos.lerp(targetPos, 0.045);
      currentScale.lerp(targetScale, 0.045);

      currentRot.x = THREE.MathUtils.lerp(currentRot.x, targetRot.x, 0.045);
      currentRot.y = THREE.MathUtils.lerp(currentRot.y, targetRot.y, 0.045);
      currentRot.z = THREE.MathUtils.lerp(currentRot.z, targetRot.z, 0.045);

      // Secondary mouse parallax (5-15px bounded shift)
      planePivot.position.x = currentPos.x + mouseX * 0.25;
      planePivot.position.y = currentPos.y - mouseY * 0.2;
      planePivot.position.z = currentPos.z;

      planePivot.rotation.x = currentRot.x - mouseY * 0.08;
      planePivot.rotation.y = currentRot.y + mouseX * 0.12;
      planePivot.rotation.z = currentRot.z;

      planePivot.scale.copy(currentScale);

      // Subtle float oscillation
      const time = Date.now() * 0.0016;
      if (planeModel) {
        planeModel.position.y = Math.sin(time) * 0.05;
        planeModel.rotation.z = Math.cos(time * 0.8) * 0.03;
      }

      if (lightRaysGroupRef.current && lightRaysGroupRef.current.visible) {
        lightRaysGroupRef.current.position.x = Math.sin(time * 0.5) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateFlightPath, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateFlightPath);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isVisible]);

  // Dynamically update material and light rays for light mode
  useEffect(() => {
    if (lightRaysGroupRef.current) {
      lightRaysGroupRef.current.visible = theme === 'light';
    }

    if (materialRef.current) {
      if (theme === 'light') {
        materialRef.current.color.setHex(0xfcfbf9);
        materialRef.current.roughness = 0.45;
        if (lightsRef.current.violetRimLight) {
          lightsRef.current.violetRimLight.color.setHex(0x7c3aed);
          lightsRef.current.violetRimLight.intensity = 3.5;
        }
      } else {
        materialRef.current.color.setHex(0xffffff);
        materialRef.current.roughness = 0.32;
        if (lightsRef.current.violetRimLight) {
          lightsRef.current.violetRimLight.color.setHex(0x8b5cf6);
          lightsRef.current.violetRimLight.intensity = 4.8;
        }
      }
    }
  }, [theme]);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 5,
          opacity: opacity,
          transition: 'opacity 0.25s ease-out',
        }}
      />

      {!modelLoaded && !loadError && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border-violet)', borderRadius: 980,
          padding: '0.4rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-violet)',
            animation: 'pulse 1.5s infinite'
          }} />
          Loading Viel 3D Scene...
        </div>
      )}
    </>
  );
}
