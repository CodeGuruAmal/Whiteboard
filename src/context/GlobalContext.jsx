import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [strokeColor, setStrokeColor] = useState("#e4e4e7");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [fillColor, setFillColor] = useState("#e4e4e700");
  const [selectedNode, setSelectedNode] = useState(null);


  const handleStrokeColor = (color) => {
    setStrokeColor(color)
  }

  const handleFillColor = (color) => {
    setFillColor(color);
  }

  const handleStrokeWidth = (width) => {
    setStrokeWidth(width);
  }


  return (
    <GlobalContext.Provider
      value={{
        handleStrokeColor,
        handleFillColor,
        handleStrokeWidth,
        strokeColor,
        fillColor,
        strokeWidth,
        selectedNode,
        setSelectedNode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};


export const useGlobal = () => useContext(GlobalContext);

export default GlobalContext;
