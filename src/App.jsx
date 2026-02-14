import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Tarot from "./Tarot";
import Nav from "./Nav";
import Ltarot from "./Ltarot";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tarot" element={<Tarot />} />
        <Route path="/ltarot" element={<Ltarot />} />
      </Routes>
    </>
  );
}

export default App;
