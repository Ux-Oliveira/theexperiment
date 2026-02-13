import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Tarot from "./Tarot";
import Nav from "./Nav";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tarot" element={<Tarot />} />
      </Routes>
    </>
  );
}

export default App;
