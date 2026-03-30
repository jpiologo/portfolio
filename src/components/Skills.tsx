import type { FC } from "react";
import NeuralNetwork, { CATEGORIES } from "./NeuralNetwork";

const Skills: FC = () => {
  return (
    <section id="skills" className="nn-section">
      <div className="nn-header">
        <h2 className="nn-title">Technical Skills</h2>
        <p className="nn-subtitle">
          My expertise spans a wide range of technologies and practices,
          enabling me to design, build, and maintain end-to-end solutions.
        </p>

        <div className="nn-legend nn-legend-top">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="nn-legend-item">
              <span className="nn-legend-dot" style={{ background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
              <span className="nn-legend-label">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      <NeuralNetwork />
    </section>
  );
};

export default Skills;
