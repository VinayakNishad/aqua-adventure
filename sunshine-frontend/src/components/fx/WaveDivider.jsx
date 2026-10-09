import "./WaveDivider.css";

/** Layered animated SVG waves used between page sections. */
export default function WaveDivider({ flip = false, tone = "light" }) {
  return (
    <div
      className={`wave-divider wave-divider--${tone} ${flip ? "wave-divider--flip" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          className="wave wave--back"
          d="M0,64 C240,112 480,16 720,48 C960,80 1200,112 1440,64 L1440,120 L0,120 Z"
        />
        <path
          className="wave wave--mid"
          d="M0,80 C200,40 440,120 720,80 C1000,40 1240,104 1440,72 L1440,120 L0,120 Z"
        />
        <path
          className="wave wave--front"
          d="M0,96 C260,72 520,120 760,100 C1000,80 1220,112 1440,96 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
