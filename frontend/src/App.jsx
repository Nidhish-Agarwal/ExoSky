import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import ExplorePage from "./pages/ExplorePage";
import LandingPage from "./pages/landingPage";
import OnboardingPage from "./pages/onboardingPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
