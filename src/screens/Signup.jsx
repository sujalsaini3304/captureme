import { useState } from "react";
import { auth, provider } from "../../firebase.config";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

export default function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showLoader, setShowLoader] = useState(false);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showAlert = (msg, type = "info") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const googleSignup = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log(user);
      showAlert("Google signup successful", "success");
    } catch (err) {
      console.error(err.message);
      showAlert("Google signup failed", "error");
    }
  };

  const signup = async () => {

    if (email.trim() === "") {
      showAlert("Enter your email", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showAlert("Enter a valid email address", "error");
      return;
    }

    if (password === "") {
      showAlert("Enter password", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    try {

      setShowLoader(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(userCredential.user);
      await signOut(auth);

      showAlert("Verification email sent. Please check your inbox.", "success");

      setShowLoader(false);

    } catch (error) {

      setShowLoader(false);

      if (error.code === "auth/email-already-in-use") {
        showAlert("Email already registered", "error");
      }
      else if (error.code === "auth/weak-password") {
        showAlert("Password should be at least 6 characters", "warning");
      }
      else {
        showAlert("Signup failed", "error");
      }

      console.log(error.message);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center
    bg-gray-50 dark:bg-gray-900 transition-colors">

      <div className="w-full max-w-sm p-6
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      rounded-xl
      text-gray-900 dark:text-gray-200">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/icon.png" className="h-10" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-medium text-center mb-3">
          Create your account
        </h2>

        {/* Alert */}
        {open && (
          <div className="mb-4">
            <Alert severity={severity} onClose={handleClose}>
              {message}
            </Alert>
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 mb-3 text-sm
          border border-gray-300 dark:border-gray-700
          rounded-md bg-white dark:bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 mb-3 text-sm
          border border-gray-300 dark:border-gray-700
          rounded-md bg-white dark:bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-3 py-2 mb-4 text-sm
          border border-gray-300 dark:border-gray-700
          rounded-md bg-white dark:bg-gray-800"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Signup Button */}
        {showLoader ? (
          <div className="flex justify-center items-center w-full py-2">
            <Box sx={{ display: "flex" }}>
              <CircularProgress size={20} />
            </Box>
          </div>
        ) : (
          <button
            onClick={signup}
            className="w-full cursor-pointer py-2 text-sm
            bg-blue-600 text-white
            rounded-md
            hover:bg-blue-700 transition"
          >
            Create account
          </button>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <div className="relative flex justify-center">
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
              OR
            </span>
          </div>
        </div>

        {/* Google Signup */}
        <button
          onClick={googleSignup}
          className="w-full cursor-pointer py-2 text-sm
          border border-gray-300 dark:border-gray-700
          rounded-md
          flex items-center justify-center gap-2
          hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="h-4 w-4"
          />
          Continue with Google
        </button>

        {/* Login link */}
        <p className="text-xs text-center mt-5 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}