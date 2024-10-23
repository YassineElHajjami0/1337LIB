"use client";
import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";

type GLTFResult = GLTF & {
  nodes: {
    Text001: THREE.Mesh;
    Text: THREE.Mesh;
    front: THREE.Mesh;
    pages: THREE.Mesh;
    cover: THREE.Mesh;
    Text002: THREE.Mesh;
  };
  materials: {
    ["Material.003"]: THREE.MeshStandardMaterial;
    ["000-Front-Cover-shabby-chic-border-q75-2560x1600"]: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
    ["Material.004"]: THREE.MeshStandardMaterial;
  };
};

export function Model({
  image,
  rotation,
}: {
  image: string | undefined;
  rotation: { x: number; y: number };
}) {
  const { nodes, materials } = useGLTF("/models/book.glb") as GLTFResult;
  const front = useRef<THREE.Mesh>(null!);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        rotation.x,
        0.1
      );
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        rotation.y,
        0.1
      );
    }
  });

  useEffect(() => {
    if (image && front.current) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";

      const texture = loader.load(image, (texture) => {
        (texture as any).encoding = THREE.SRGBColorSpace;

        // Rotate texture to be vertical
        texture.rotation = Math.PI / 2;
        texture.center.set(0.5, 0.5);

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.1,
          premultipliedAlpha: true,
          opacity: 1,
        });
        if (front.current) {
          front.current.material = material;
        }
      });
    }
  }, [image]);

  return (
    <group
      ref={modelRef}
      dispose={null}
      rotation={[-1, -1.5, 4.7]}
      scale={0.35}
      position={[-0.5, 0, 0]}
    >
      <mesh
        ref={front}
        castShadow
        receiveShadow
        geometry={nodes.front.geometry}
        material={materials["000-Front-Cover-shabby-chic-border-q75-2560x1600"]}
        position={[0, -0.34, 2.813]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pages.geometry}
        material={materials["Material.002"]}
        position={[0, -0.34, 2.813]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cover.geometry}
        material={materials["Material.004"]}
        position={[0, -0.34, 2.813]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text002.geometry}
        material={materials["Material.003"]}
        position={[0, -0.34, 2.813]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/models/book.glb");

export default function canvasComponent({
  image,
}: {
  image: string | undefined;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: -1, y: -1.4 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth) * 0.7;
      const y = -(event.clientY / innerHeight) * 1.1;

      setRotation((prevRotation) => ({
        x: -1 + x,
        y: -1.4 + y,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <Canvas ref={canvasRef} className="model">
      <ambientLight intensity={0.5} />
      <directionalLight position={[-2, 5, 2]} />
      <Suspense fallback={null}>
        <Model image={image} rotation={rotation} />
      </Suspense>
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </Canvas>
  );
}
