import Home from "./Pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register/Register";
import Login from "./Pages/login/Login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<Home /> />
        <Route path="/register" element=<Register /> />
        <Route path="/login" element=<Login /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
