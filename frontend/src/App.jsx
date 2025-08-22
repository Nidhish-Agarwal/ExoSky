import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import ExplorePage from "./pages/ExplorePage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;