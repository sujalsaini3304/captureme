import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";

import Dashboard from "./screens/Dashboard";
import Setting from "./screens/Setting";
import MainLayout from "./layouts/MainLayouts";
import SecondaryLayout from "./layouts/SecondaryLayout";
import OnboardingPage from "./screens/OnboardingPage";
import ProtectedRoute from "./ProtectedRoute";

import AOS from "aos";
import "aos/dist/aos.css";

import CircularProgress from "@mui/material/CircularProgress";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import ResetPassword from "./screens/ResetPassword";

const App = () => {

  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const location = useLocation();

  const hasPasswordProvider = user?.providerData?.some(
    (provider) => provider.providerId === "password"
  );
  const isAuthenticated = !!user && (!hasPasswordProvider || user.emailVerified);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

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
      <div className={`min-h-screen ${localStorage.getItem("theme") === "dark" ? "bg-gray-900" : "bg-white"} text-foreground relative`}>

        <div
          className={`
          fixed inset-0 z-[9999]
          flex items-center justify-center
          ${localStorage.getItem("theme") === "dark" ? "bg-gray-900" : "bg-white"}
          transition-opacity duration-300
          ${isLoaded ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
        `}
        >
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

      </div>
    );
  }

  return (
    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <OnboardingPage />
        }
      />

      {/* Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute user={user}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Protected Settings */}
      <Route
        element={
          <ProtectedRoute user={user}>
            <SecondaryLayout name="Settings" />
          </ProtectedRoute>
        }
      >
        <Route path="/setting" element={<Setting />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
  );
};

export default App;