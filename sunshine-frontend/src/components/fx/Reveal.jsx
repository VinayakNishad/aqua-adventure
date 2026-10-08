import useInView from "../../hooks/useInView";
import "./Reveal.css";

/**
 * Animates its children into view on scroll.
 * effect: "up" | "zoom" | "flip" | "left" | "right"
 */
export default function Reveal({
  as: Tag = "div",
  effect = "up",
  delay = 0,
  className = "",
  children,
}) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${effect} ${inView ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
