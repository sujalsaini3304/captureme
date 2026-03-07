import { useState , useEffect } from "react";
import { auth, provider } from "../../firebase.config";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const navigate = useNavigate();

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user && user.emailVerified) {
        navigate("/dashboard");
      }

    });

    return () => unsubscribe();

  }, []);

  const showAlert = (msg, type = "info") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const googleLogin = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log(user);
      showAlert("Google login successful", "success");
    } catch (err) {
      console.error(err.message);
      showAlert("Google login failed", "error");
    }
  };

  const emailLogin = async () => {

    try {

      setShowLoader(true);

      if (email.trim() === "") {
        setShowLoader(false);
        showAlert("Enter your email", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setShowLoader(false);
        showAlert("Enter a valid email address", "error");
        return;
      }

      if (password === "") {
        setShowLoader(false);
        showAlert("Enter password", "error");
        return;
      }

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        await signOut(auth);
        setShowLoader(false);
        showAlert("Please verify your email first", "warning");
        return;
      }

      setShowLoader(false);
      showAlert("Login successful", "success");

      console.log(user);

    } catch (err) {

      setShowLoader(false);

      if (err.code === "auth/user-not-found") {
        showAlert("User not found", "error");
      }
      else if (err.code === "auth/wrong-password") {
        showAlert("Wrong password", "error");
      }
      else {
        showAlert("Login failed", "error");
      }

      console.error(err.message);
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

        <div className="flex justify-center mb-4">
          <img src="/icon.png" className="h-10" />
        </div>

        <h2 className="text-lg font-medium text-center mb-3">
          Sign in to your account
        </h2>

        {/* Alert Message */}
        {open && (
          <div className="mb-4">
            <Alert severity={severity} onClose={handleClose}>
              {message}
            </Alert>
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 mb-4 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {showLoader ?
          (
            <div className="flex justify-center items-center w-full py-2">
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size={20} />
              </Box>
            </div>
          )
          :
          (
            <button
              onClick={emailLogin}
              className="w-full py-2 cursor-pointer text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Sign in
            </button>
          )
        }

        <Link to="/signup">
          <div className="justify-center cursor-pointer flex items-center w-full py-2 mt-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Create account
          </div>
        </Link>

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

        <button
          onClick={googleLogin}
          className="w-full py-2 cursor-pointer text-sm border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="h-4 w-4"
          />
          Continue with Google
        </button>

        <p className="text-xs text-center mt-5 text-gray-500">
          need to reset password?{" "}
          <Link to="/reset-password" className="text-blue-600 hover:underline">
            Reset password
          </Link>
        </p>

      </div>
    </div>
  );
}