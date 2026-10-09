import "./UserAvatar.css";

/** Circle showing the first letter of a person's name. */
export default function UserAvatar({ name }) {
  const initial = name?.trim().charAt(0).toUpperCase() || "?";
  return (
    <span className="user-avatar" aria-hidden="true">
      {initial}
    </span>
  );
}
