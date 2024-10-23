import React from "react";
import Canvas from "./components/Draw/Canvas";
import Option from "./components/Option";
import { GlobalProvider } from "./context/GlobalContext";

const App = () => {
  return (
    <GlobalProvider>
      <Option />
      <Canvas />
    </GlobalProvider>
  );
};

export default App;
