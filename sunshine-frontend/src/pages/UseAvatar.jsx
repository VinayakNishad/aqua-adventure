// Add this helper component inside your PackageDetail.js file
const UserAvatar = ({ name }) => {
  // Get the first letter of the name, or a fallback character
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Styles for the avatar circle
  const avatarStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#56b3ffff", // A default blue, you can randomize this
    color: "white",
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginRight: "10px",
    marginTop: "4px" // Space between avatar and name
  };

  return <div style={avatarStyle}>{initial}</div>;
};
export default UserAvatar;