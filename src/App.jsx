import { useState } from "react";
import { InventoryProvider } from "./hooks/useInventory.jsx";
import InventoryPanel from "./components/inventory/InventoryPanel.jsx";
import GeneratorPanel from "./components/generator/GeneratorPanel.jsx";
import BuildViewer from "./components/viewer/BuildViewer.jsx";
import { Blocks } from "lucide-react";

function App() {
  const [activeBuild, setActiveBuild] = useState(null); // { template, fitResult }
  const [mobileTab, setMobileTab] = useState("inventory"); // "inventory" | "generate"

  const handleBuild = (template, fitResult) => {
    setActiveBuild({ template, fitResult });
  };

  const handleClose = () => setActiveBuild(null);

  return (
    <InventoryProvider>
      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="logo">
            <Blocks size={22} />
            <span>BrickForge</span>
          </div>
          <p className="tagline">Turn your bricks into builds</p>
        </header>

        {/* Mobile tab switcher */}
        <div className="mobile-tabs">
          <button
            className={`tab-btn ${mobileTab === "inventory" ? "active" : ""}`}
            onClick={() => setMobileTab("inventory")}
          >
            My Bricks
          </button>
          <button
            className={`tab-btn ${mobileTab === "generate" ? "active" : ""}`}
            onClick={() => setMobileTab("generate")}
          >
            Generate
          </button>
        </div>

        {/* Main layout */}
        {activeBuild ? (
          <div className="viewer-wrap">
            <BuildViewer
              template={activeBuild.template}
              fitResult={activeBuild.fitResult}
              onClose={handleClose}
            />
          </div>
        ) : (
          <main className="app-main">
            <div className={`col-inventory ${mobileTab === "inventory" ? "mob-visible" : "mob-hidden"}`}>
              <InventoryPanel />
            </div>
            <div className={`col-generate ${mobileTab === "generate" ? "mob-visible" : "mob-hidden"}`}>
              <GeneratorPanel onBuild={handleBuild} />
            </div>
          </main>
        )}

        <footer className="app-footer">
          Open source · Free forever · Parts data from{" "}
          <a href="https://rebrickable.com" target="_blank" rel="noreferrer">Rebrickable</a>
        </footer>
      </div>
    </InventoryProvider>
  );
}

export default App;
