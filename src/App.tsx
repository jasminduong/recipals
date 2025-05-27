import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ReciPals from "./ReciPals";
import { Provider } from "react-redux";
import store from "./ReciPals/store";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/ReciPals/Home" />} />
            <Route path="/ReciPals/*" element={<ReciPals />} />
          </Routes>
        </div>
      </HashRouter>
    </Provider>
  );
}

export default App;
