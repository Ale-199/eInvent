import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";

import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
