import { BUBBLES } from "../../constants/animation";
import "./Bubbles.css";

/** Decorative rising bubbles, rendered purely with CSS animation. */
export default function Bubbles({ className = "" }) {
  return (
    <div className={`bubbles ${className}`.trim()} aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
