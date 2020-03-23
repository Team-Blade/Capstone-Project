import React from "react";
import Game from "./Game";
import Form from "./Form";
import SideBar from "./SideBar";
// import Footer from "./components/Footer";

// import "./style.css";

const App = () => {
  return (
    <div id="main-wrapper">
      <main>
        <h1>Pac Man Battle Royal</h1>
        <Form />
        {/* <Game /> */}
        <SideBar />
      </main>
    </div>
  );
};

export default App;
