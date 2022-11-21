import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/signin/SignIn";

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<SignIn />} exact />
      </Routes>
    </React.Fragment>
  );
}

export default App;
