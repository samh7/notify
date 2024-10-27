import React from "react";

const Spinner = ({ color = "bg-blue-600" }) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce`} style={{ animationDelay: "0s" }}></div>
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce`} style={{ animationDelay: "0.2s" }}></div>
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce`} style={{ animationDelay: "0.4s" }}></div>
    </div>
  );
};

export default Spinner;
