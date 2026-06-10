import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, Environment } from "@react-three/drei";
import { BrickBox } from "./BrickBox.jsx";
import { brickTo3D, computeCenter } from "../../engine/layout.js";

function AutoRotate({ children, speed = 0.003 }) {
  const ref = useRef();
  useFrame(() => { if (ref.current) ref.current.rotation.y += speed; });
  return <group ref={ref}>{children}</group>;
}

// Visible steps up to and including current step
const GHOST_OPACITY = 0.12;

export default function BuildScene({ template, steps, currentStep, autoRotate }) {
  const allBricks = useMemo(() => template.build(), [template]);

  // Convert all bricks to 3D coords
  const bricks3D = useMemo(
    () => allBricks.map(b => ({ ...brickTo3D(b), step: b.step })),
    [allBricks]
  );

  // Center offset
  const center = useMemo(() => computeCenter(bricks3D), [bricks3D]);

  // Current step number (steps are 1-indexed in template)
  const currentStepNum = steps[currentStep]?.stepNumber ?? 1;

  const Wrapper = autoRotate
    ? ({ children }) => <AutoRotate>{children}</AutoRotate>
    : ({ children }) => <group>{children}</group>;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-8, 5, -10]} intensity={0.3} />
      <Environment preset="city" />

      <Grid
        position={[0, -0.02, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#c0b8b0"
        sectionSize={4}
        sectionThickness={0.8}
        sectionColor="#a0988e"
        fadeDistance={22}
        fadeStrength={1.2}
        infiniteGrid
      />

      <Wrapper>
        <group position={[-center.cx, -center.cy * 0.5, -center.cz]}>
          {bricks3D.map((b, i) => {
            const isCurrentStep = b.step === currentStepNum;
            const isBuilt       = b.step < currentStepNum;
            const isFuture      = b.step > currentStepNum;

            return (
              <BrickBox
                key={i}
                x={b.x}
                y={b.y}
                z={b.z}
                w={b.w}
                h={b.h}
                d={b.d}
                color={b.color}
                opacity={isFuture ? GHOST_OPACITY : 1}
                highlight={isCurrentStep}
              />
            );
          })}
        </group>
      </Wrapper>
    </>
  );
}
