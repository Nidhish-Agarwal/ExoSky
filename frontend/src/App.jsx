import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthPage from "./pages/AuthPage";
import ExplorePage from "./pages/ExplorePage";
import LandingPage from "./pages/LandingPage";
import ExoSkyExplorer from "./components/visualize/ExoskyExplorer";
import OnboardingPage from "./pages/OnboardingPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <div>
      <ToastContainer
        position="top-right" // You can change this
        autoClose={3000} // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" // "light" | "dark" | "colored"
      />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/visualize/:plName" element={<ExoSkyExplorer />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/gallary" element={<Gallery />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
