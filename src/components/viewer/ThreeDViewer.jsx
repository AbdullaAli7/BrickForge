import { Suspense, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { RotateCcw, Maximize2, Box } from "lucide-react";
import BuildScene from "./BuildScene.jsx";
import { brickTo3D, computeCenter } from "../../engine/layout.js";

function Loader() {
  return (
    <mesh position={[0, 0.6, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#F5C518" wireframe />
    </mesh>
  );
}

export default function ThreeDViewer({ template, steps, currentStep }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  // Compute camera distance based on model size
  const camDist = useMemo(() => {
    const bricks3D = template.build().map(b => brickTo3D(b));
    const { span } = computeCenter(bricks3D);
    return Math.max(span * 1.3, 12);
  }, [template]);

  const containerClass = `viewer-3d-container ${fullscreen ? "viewer-3d-fullscreen" : ""}`;

  return (
    <div className={containerClass}>
      <div className="viewer-3d-toolbar">
        <span className="viewer-3d-label">
          <Box size={13} />
          3D preview
        </span>
        <div className="viewer-3d-actions">
          <button
            className={`viewer-3d-btn ${autoRotate ? "active" : ""}`}
            title={autoRotate ? "Stop rotation" : "Auto-rotate"}
            onClick={() => setAutoRotate(r => !r)}
          >
            <RotateCcw size={14} />
          </button>
          <button
            className="viewer-3d-btn"
            title={fullscreen ? "Exit fullscreen" : "Expand"}
            onClick={() => setFullscreen(f => !f)}
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="viewer-3d-legend">
        <span className="legend-dot" style={{ background: "#F5C518" }} /> Current step
        <span className="legend-dot" style={{ background: "#C1392B" }} /> Built
        <span className="legend-dot" style={{ background: "rgba(150,150,150,0.3)", border: "1px solid #bbb" }} /> Upcoming
      </div>

      <Canvas shadows gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
        <PerspectiveCamera makeDefault position={[camDist, camDist * 0.7, camDist]} fov={38} />
        <OrbitControls
          enablePan={true}
          minDistance={4}
          maxDistance={50}
          maxPolarAngle={Math.PI * 0.85}
          dampingFactor={0.1}
          enableDamping
        />
        <Suspense fallback={<Loader />}>
          <BuildScene
            template={template}
            steps={steps}
            currentStep={currentStep}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>

      <p className="viewer-3d-hint">Drag to orbit · Scroll to zoom · Shift+drag to pan</p>
    </div>
  );
}
