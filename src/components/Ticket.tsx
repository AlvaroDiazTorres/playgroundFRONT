import { useEffect, useRef } from "react";
import * as THREE from 'three';

interface TicketProps {
  ticketImage: string;
  price: number;
}

export default function Ticket({ ticketImage, price }: TicketProps) {
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
    const texture = loader.load(ticketImage);

    const ancho = 5;
    const alto = ancho * Math.sqrt(2);
    const geometry = new THREE.PlaneGeometry(ancho, alto);

    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      side: THREE.FrontSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

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
      mesh.rotation.y += deltaX * 0.01;
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
        mesh.rotation.y += 0.002;
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
      material.dispose();
      texture.dispose();
    };
  }, [ticketImage]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} id="ticket" className='mb-3'/>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
        <span className="text-xl font-bold">€{price}</span>
      </div>
    </div>
  );
} 