import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import ExplorePage from "./pages/ExplorePage";
import LandingPage from "./pages/landingPage";
import ExoSkyExplorer from "./components/visualize/ExoskyExplorer";
import OnboardingPage from "./pages/onboardingPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import VisualizationPage from "./pages/VisualizationPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/explore" element={<ExplorePage />} />
           </Route>
          <Route path="/visualize" element={<ExoSkyExplorer/>}/>
          <Route path="/visualize/:plName" element={<VisualizationPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
