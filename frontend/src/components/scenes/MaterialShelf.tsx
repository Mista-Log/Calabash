"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Text,
  MeshDistortMaterial,
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { Material } from "@/services/api";

function MaterialCard({
  material,
  position,
}: {
  material: Material;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t / 2) / 8;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) / 10;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={position}>
        <RoundedBox
          ref={meshRef}
          args={[0.8, 1.2, 0.05]}
          radius={0.05}
          smoothness={4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => console.warn("Selected:", material.title)}
        >
          <MeshDistortMaterial
            color={
              hovered ? oklchToHex(0.85, 0.2, 85) : oklchToHex(0.45, 0.15, 35)
            }
            speed={0}
            distort={0}
            roughness={0.1}
            metalness={0.2}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.08}
          color="white"
          maxWidth={0.6}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {material.courseCode}
        </Text>
      </group>
    </Float>
  );
}

// Helper to convert OKLCH to Hex for Three.js which doesn't natively support CSS OKLCH yet easily in meshes
function oklchToHex(l: number, _c: number, _h: number) {
  // Simple mapping for demo colors
  if (l === 0.85) return "#FFBF00"; // Amber
  if (l === 0.45) return "#8B4513"; // Sienna
  return "#ffffff";
}

export function MaterialShelf({ materials }: { materials: Material[] }) {
  return (
    <div className="h-[400px] w-full rounded-xl border bg-linear-to-b from-accent/5 to-transparent relative overflow-hidden">
      <div className="absolute top-4 left-6 z-10">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-widest">
          Interactive Archive
        </h3>
        <p className="text-xs text-muted-foreground">
          Select a material to visualize
        </p>
      </div>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <Environment preset="city" />

        <group position={[0, 0.5, 0]}>
          {materials.map((m, i) => (
            <MaterialCard
              key={m.id}
              material={m}
              position={[(i - (materials.length - 1) / 2) * 1.2, 0, 0]}
            />
          ))}
        </group>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4.5}
        />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
