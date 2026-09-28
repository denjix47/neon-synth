import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { synthEngine } from './synthEngine';
import { VisualizerTheme } from './types';

interface Visualizer3DProps {
  theme: VisualizerTheme;
  activeNotesCount: number;
}

export const Visualizer3D: React.FC<Visualizer3DProps> = ({ theme, activeNotesCount }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<VisualizerTheme>(theme);
  themeRef.current = theme;
  const activeNotesRef = useRef(activeNotesCount);
  activeNotesRef.current = activeNotesCount;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a16, 0.03);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 2, 50);
    pointLight.position.set(0, 10, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff00ff, 2, 50);
    pointLight2.position.set(-5, 2, -5);
    scene.add(pointLight2);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const gridHelper = new THREE.GridHelper(30, 30, 0xff00ff, 0x00ffff);
    gridHelper.position.y = -1;
    mainGroup.add(gridHelper);

    const barCount = 32;
    const barGroup = new THREE.Group();
    const bars: THREE.Mesh[] = [];
    const barGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    for (let i = 0; i < barCount; i++) {
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / barCount, 0.9, 0.5),
        emissive: new THREE.Color().setHSL(i / barCount, 0.8, 0.2),
        shininess: 100,
      });
      const bar = new THREE.Mesh(barGeo, mat);
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 6;
      bar.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      barGroup.add(bar);
      bars.push(bar);
    }
    mainGroup.add(barGroup);

    const coreGeo = new THREE.IcosahedronGeometry(2, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x8800ff,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 2;
    mainGroup.add(coreMesh);

    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalY = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 20 + 5;
      const z = (Math.random() - 0.5) * 40;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalY[i] = y;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const dataArray = new Uint8Array(128);

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const analyser = synthEngine.getAnalyser();
      let avgFreq = 0;
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        avgFreq = sum / dataArray.length;
      }

      const freqNormalized = avgFreq / 255;
      const t = time * 0.001;

      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 + 5 - camera.position.y) * 0.05;
      camera.lookAt(0, 1.5, 0);

      coreMesh.rotation.x = t * 0.5;
      coreMesh.rotation.y = t * 0.8;
      const scale = 1 + freqNormalized * 0.8 + (activeNotesRef.current > 0 ? 0.2 : 0);
      coreMesh.scale.set(scale, scale, scale);

      pointLight.intensity = 1.5 + freqNormalized * 3;
      pointLight2.intensity = 1.5 + freqNormalized * 3;

      for (let i = 0; i < bars.length; i++) {
        const val = dataArray[i * 2] || 0;
        const h = Math.max(0.2, (val / 255) * 8);
        bars[i].scale.y = h;
        bars[i].position.y = h / 2 - 1;
      }

      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        posArray[iy] = originalY[i] + Math.sin(t * 2 + posArray[ix] * 0.2 + posArray[iz] * 0.2) * (0.5 + freqNormalized * 2);
      }
      posAttr.needsUpdate = true;

      const currentTheme = themeRef.current;
      if (currentTheme === 'neon-grid') {
        gridHelper.visible = true;
        barGroup.visible = true;
        coreMat.wireframe = true;
      } else if (currentTheme === 'cosmic-spheres') {
        gridHelper.visible = false;
        barGroup.visible = false;
        coreMat.wireframe = false;
      } else {
        gridHelper.visible = true;
        barGroup.visible = true;
        coreMat.wireframe = true;
      }

      mainGroup.rotation.y = t * 0.1;

      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 shadow-2xl">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur text-xs font-mono text-cyan-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        3D REALTIME VISUALIZER
      </div>
    </div>
  );
};
