import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STUD_R, STUD_H, BRICK_GAP } from "../../engine/layout.js";

/**
 * One LEGO brick with studs on top.
 */
export function BrickBox({
  x = 0, y = 0, z = 0,
  w = 1, h = 0.96, d = 1,
  color = "#C1392B",
  opacity = 1,
  highlight = false,
}) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (highlight && meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.material.emissiveIntensity = 0.35 + Math.sin(t * 3.5) * 0.15;
    }
  });

  const transparent = opacity < 1;
  const col = useMemo(() => new THREE.Color(color), [color]);
  const emCol = useMemo(() => highlight ? new THREE.Color(color) : new THREE.Color(0x000000), [color, highlight]);

  const studs = useMemo(() => {
    const cols = Math.max(1, Math.round(w));
    const rows = Math.max(1, Math.round(d));
    const out = [];
    const sx = -(cols - 1) / 2;
    const sz = -(rows - 1) / 2;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        out.push([sx + c, sz + r]);
      }
    }
    return out;
  }, [w, d]);

  const bw = w - BRICK_GAP;
  const bh = h - BRICK_GAP;
  const bd = d - BRICK_GAP;

  return (
    <group position={[x, y, z]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[bw, bh, bd]} />
        <meshStandardMaterial
          color={col}
          opacity={opacity}
          transparent={transparent}
          emissive={emCol}
          emissiveIntensity={highlight ? 0.4 : 0}
          roughness={0.45}
          metalness={0.0}
          depthWrite={!transparent}
        />
      </mesh>

      {opacity > 0.3 && studs.map(([sx, sz], i) => (
        <mesh key={i} position={[sx, bh / 2 + STUD_H / 2, sz]} castShadow>
          <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 8]} />
          <meshStandardMaterial
            color={col}
            opacity={opacity}
            transparent={transparent}
            roughness={0.4}
            depthWrite={!transparent}
          />
        </mesh>
      ))}
    </group>
  );
}
