import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ReciPals from "./ReciPals"; 

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="ReciPals/Home" />} />
          <Route path="/ReciPals/*" element={<ReciPals />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
