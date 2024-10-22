"use client";
import * as THREE from "three";
import React, { Suspense, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Canvas } from "@react-three/fiber";
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

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/book.glb") as GLTFResult;
  return (
    <group {...props} dispose={null} rotation={[-1, -1.5, 4]} scale={0.5}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text001.geometry}
        material={materials["Material.003"]}
        position={[0, -0.34, 2.813]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text.geometry}
        material={materials["Material.003"]}
        position={[0, -0.34, 2.813]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
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

export default function canvasComponent() {
  return (
    <Canvas className="model">
      <ambientLight intensity={0.5} />
      <directionalLight position={[-2, 5, 2]} />
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, 10]}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        <Model position={[-0.5, 0, 0]} />
      </Suspense>
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </Canvas>
  );
}
