import { useState, type FC } from "react";
import NeuralNetwork, { CATEGORIES } from "./NeuralNetwork";

const Skills: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleCategory = (name: string) => {
    setActiveCategory((prev) => (prev === name ? null : name));
  };

  return (
    <section id="skills" className="nn-section">
      {/* Subtle radial glow overlays */}
      <div className="nn-bg-glow nn-bg-glow-1" />
      <div className="nn-bg-glow nn-bg-glow-2" />

      <div className="nn-header">
        <h2 className="nn-title">Technical Skills</h2>
        <p className="nn-subtitle">
          End-to-end expertise across modern technologies and engineering practices. <br /><br /> 
          <span className="text-gray-600">(Hover for more)</span>
        </p>

        <div className="nn-legend nn-legend-top">
          {CATEGORIES.map((c) => {
            const isActive = activeCategory === c.name;
            return (
              <button
                key={c.name}
                type="button"
                className={`nn-legend-item${isActive ? " nn-legend-item-active" : ""}`}
                onClick={() => toggleCategory(c.name)}
                style={
                  {
                    "--chip-color": c.color,
                    "--chip-glow": `${c.color}30`,
                  } as React.CSSProperties
                }
              >
                <span
                  className="nn-legend-dot"
                  style={{
                    background: c.color,
                    boxShadow: `0 0 ${isActive ? "10px" : "6px"} ${c.color}`,
                  }}
                />
                <span className="nn-legend-label">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <NeuralNetwork activeCategory={activeCategory} />
    </section>
  );
};

export default Skills;
