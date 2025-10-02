import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin } from 'lucide-react';
import earthTexture from '@/assets/earth-texture.jpg';

interface Globe3DProps {
  targetLocation?: { lat: number; lng: number; name: string };
  onAnimationComplete?: () => void;
  showPin?: boolean;
}

function Globe({ targetLocation, onAnimationComplete, showPin }: Omit<Globe3DProps, 'children'>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const animating = useRef(false);
  const startRotation = useRef<THREE.Euler | null>(null);
  const texture = useTexture(earthTexture);

  useEffect(() => {
    if (targetLocation && !animating.current) {
      animating.current = true;
      startRotation.current = meshRef.current?.rotation.clone() || null;
      
      // Convert lat/lng to rotation
      const targetRotation = {
        x: (90 - targetLocation.lat) * (Math.PI / 180),
        y: -targetLocation.lng * (Math.PI / 180),
      };

      // Animate to target
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        if (meshRef.current && startRotation.current) {
          meshRef.current.rotation.x = startRotation.current.x + (targetRotation.x - startRotation.current.x) * eased;
          meshRef.current.rotation.y = startRotation.current.y + (targetRotation.y - startRotation.current.y) * eased;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          animating.current = false;
          onAnimationComplete?.();
        }
      };

      animate();
    }
  }, [targetLocation, onAnimationComplete]);

  useFrame((state) => {
    if (!animating.current && meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    
    // Pin follows globe rotation
    if (pinRef.current && meshRef.current && showPin) {
      pinRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  return (
    <>
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      
      {showPin && (
        <group ref={pinRef}>
          <mesh position={[0, 2.5, 0]}>
            <coneGeometry args={[0.1, 0.4, 8]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </>
  );
}

export default function Globe3D({ targetLocation, onAnimationComplete, showPin }: Globe3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00e5ff" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Globe targetLocation={targetLocation} onAnimationComplete={onAnimationComplete} showPin={showPin} />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
      </Canvas>
      
      {showPin && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-pin-drop">
            <MapPin className="w-8 h-8 text-accent drop-shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
