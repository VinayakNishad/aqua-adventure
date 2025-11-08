import React from "react";
import logo from "../assets/diving-equipment.gif"; // ✅ put your logo inside src/assets folder

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-200 to-blue-500">
      {/* Logo */}
      <img
        src={logo}
        alt="Aqua Adventure Logo"
        className="w-24 h-24 animate-bounce"
      />


      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-danger border-opacity-70"></div>

     
    </div>
  );
};

export default Loader;
