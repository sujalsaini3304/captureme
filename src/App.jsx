import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Dashboard from "./screens/Dashboard";
import Setting from "./screens/Setting";
import MainLayout from "./layouts/MainLayouts";
import SecondaryLayout from "./layouts/SecondaryLayout";
import OnboardingPage from "./screens/OnboardingPage";
import ProtectedRoute from "./ProtectedRoute";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CircularProgress from '@mui/material/CircularProgress';

const App = () => {
  const { isSignedIn, isLoaded } = useAuth();

  const location = useLocation();


  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [location]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 text-foreground relative">

        {/* ── Splash Screen Overlay (blocks all interaction) ── */}
        <div
          className={`
          fixed inset-0 z-[9999]
          flex items-center justify-center
          bg-gray-900
          transition-opacity duration-300
          ${isLoaded ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
        `}
          // Extra safety: block keyboard, scroll, and touch
          onKeyDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.preventDefault()}
          aria-hidden="false"
          aria-busy="true"
          aria-label="Loading, please wait"
        >
          {/* Prevent tab focus escaping to content behind */}
          <div tabIndex={-1} style={{ outline: "none" }}>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 text-2xl font-semibold select-none">
                <img
                  src="/icon.png"
                  className="h-10 w-10 object-contain animate-pulse"
                  alt="logo"
                  draggable={false}
                />
                <span>
                  Snap<span className="text-blue-600">Dock</span>
                </span>
              </div>

              <CircularProgress size={26} sx={{ color: "#2563eb" }} />

              <p className="text-sm text-muted-foreground select-none">
                Preparing your workspace...
              </p>
            </div>
          </div>
        </div>

        {/* ── App Content (visually hidden + inert while loading) ── */}
        <div
          className={isLoaded ? "visible" : "invisible"}
          // `inert` disables all interaction (clicks, focus, scroll) on the content below
          {...(!isLoaded ? { inert: "" } : {})}
        >
          <Routes>
            {/* your routes */}
          </Routes>
        </div>

      </div>
    );
  }

  return (
    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={
          isSignedIn ? <Navigate to="/dashboard" replace /> : <OnboardingPage />
        }
      />

      {/* Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Protected Settings */}
      <Route
        element={
          <ProtectedRoute>
            <SecondaryLayout name="Settings" />
          </ProtectedRoute>
        }
      >
        <Route path="/setting" element={<Setting />} />
      </Route>

    </Routes>
  );
};

export default App;