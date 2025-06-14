import { useEffect, useRef } from "react";
import * as THREE from 'three';

interface CartelProps {
  cartelFront: string;
  cartelBack: string;
}

export default function Cartel({ cartelFront, cartelBack }: CartelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const loader = new THREE.TextureLoader();
    const frontTexture = loader.load(cartelFront);
    const backTexture = loader.load(cartelBack);

    const ancho = 5;
    const alto = ancho * Math.sqrt(2);
    const geometry = new THREE.PlaneGeometry(ancho, alto);

    const frontMaterial = new THREE.MeshBasicMaterial({ 
      map: frontTexture,
      side: THREE.FrontSide
    });
    const backMaterial = new THREE.MeshBasicMaterial({ 
      map: backTexture,
      side: THREE.FrontSide
    });

    const frontMesh = new THREE.Mesh(geometry, frontMaterial);
    const backMesh = new THREE.Mesh(geometry, backMaterial);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -0.001;

    const group = new THREE.Group();
    group.add(frontMesh);
    group.add(backMesh);
    scene.add(group);

    let isDragging = false;
    let autoRotate = true;
    let lastInteractionTime = Date.now();
    const idleDelay = 3000;
    let previousMouseX = 0;

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      previousMouseX = event.clientX;
    };

    const onMouseUp = () => {
      isDragging = false;
      lastInteractionTime = Date.now();
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousMouseX;
      group.rotation.y += deltaX * 0.01;
      previousMouseX = event.clientX;
      lastInteractionTime = Date.now();
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      const now = Date.now();
      if (!isDragging && now - lastInteractionTime > idleDelay) {
        autoRotate = true;
      }
      if (autoRotate) {
        group.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      frontTexture.dispose();
      backTexture.dispose();
    };
  }, [cartelFront, cartelBack]);

  return <canvas ref={canvasRef} id="bg" className='mb-3'/>;
}