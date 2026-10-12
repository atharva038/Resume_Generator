import React from "react";

const PageTransition = ({ children }) => {
  return (
    <div
      className="page-transition page-transition-enter w-full h-full"
    >
      {children}
    </div>
  );
};

export default PageTransition;

