import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { StarStage } from '../types';

interface StarSceneProps {
  stage: StarStage;
}

const MainSequenceStar = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial 
        color="#4488ff" 
        emissive="#0044aa"
        emissiveIntensity={2}
        roughness={0.1}
      />
      <pointLight intensity={5} color="#4488ff" distance={20} decay={2} />
    </mesh>
  );
};

const RedSupergiant = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
      const scale = 4.5 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        color="#ff3300" 
        emissive="#aa1100"
        emissiveIntensity={0.8}
        roughness={0.7}
        metalness={0.1}
      />
      <pointLight intensity={3} color="#ff5500" distance={30} decay={2} />
    </mesh>
  );
};

const SupernovaExplosion = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  
  const particleCount = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = (Math.random() - 0.5) * 15; 
      pos[i * 3] = r;
      pos[i * 3 + 1] = r;
      pos[i * 3 + 2] = r;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      const expansion = (Math.sin(time * 2) + 1) * 4 + 1; 
      particlesRef.current.scale.set(expansion, expansion, expansion);
    }

    if (shockwaveRef.current) {
        const shockScale = (time % 2.5) * 20;
        shockwaveRef.current.scale.set(shockScale, shockScale, shockScale);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - (time % 2.5) / 2);
    }
  });

  return (
    <group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#ffaa00" sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>
      
      <mesh ref={shockwaveRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} side={THREE.BackSide} />
      </mesh>
      <pointLight intensity={15} color="#ffaa00" distance={50} decay={2} />
    </group>
  );
};

const NeutronStar = () => {
  const starRef = useRef<THREE.Mesh>(null);
  const jetRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.y += 0.5;
    }
    if (jetRef.current) {
        jetRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        jetRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
        jetRef.current.rotation.y += 0.5;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={starRef}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ffff"
            emissiveIntensity={4}
            roughness={0.2}
            metalness={1}
          />
        </mesh>

        <group ref={jetRef}>
            <mesh position={[0, 4, 0]}>
                <cylinderGeometry args={[0.05, 0.3, 12, 16, 1, true]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
             <mesh position={[0, -4, 0]} rotation={[Math.PI, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.3, 12, 16, 1, true]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
        </group>

        <pointLight color="#00ffff" intensity={5} distance={30} decay={2} />
      </Float>
    </group>
  );
};

const SceneContent: React.FC<{ stage: StarStage }> = ({ stage }) => {
  return (
    <>
        {stage === StarStage.MAIN_SEQUENCE && <MainSequenceStar />}
        {stage === StarStage.RED_SUPERGIANT && <RedSupergiant />}
        {stage === StarStage.SUPERNOVA && <SupernovaExplosion />}
        {stage === StarStage.NEUTRON_STAR && <NeutronStar />}
    </>
  )
}

const StarScene: React.FC<StarSceneProps> = ({ stage }) => {
  return (
      <Canvas 
        camera={{ position: [0, 2, 14], fov: 45 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#05050a']} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        
        <SceneContent stage={stage} />

        <EffectComposer enableNormalPass={false} multisampling={0}>
             <Bloom 
                luminanceThreshold={1} 
                intensity={1.5} 
                radius={0.5} 
             />
        </EffectComposer>

        <OrbitControls enablePan={false} enableZoom={true} minDistance={5} maxDistance={50} />
      </Canvas>
  );
};

export default StarScene;