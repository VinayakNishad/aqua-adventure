import { WHY_CHOOSE_US } from "../../constants/packageInfo";
import "./WhyChooseUs.css";

/** Four one-line trust signals. */
export default function WhyChooseUs() {
  return (
    <ul className="why-us" aria-label="Why choose us">
      {WHY_CHOOSE_US.map((item) => (
        <li key={item.title}>
          <i className={`bi ${item.icon}`} aria-hidden="true" />
          <strong>{item.title}</strong>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
