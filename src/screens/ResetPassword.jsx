import { useState } from "react";
import { auth } from "../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

export default function ResetPassword() {

    const [email, setEmail] = useState("");
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

    const resetPassword = async () => {

        if (email.trim() === "") {
            showAlert("Enter your email", "error");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showAlert("Enter a valid email address", "error");
            return;
        }

        try {

            setShowLoader(true);

            await sendPasswordResetEmail(auth, email);

            showAlert("Password reset email sent. Check your inbox.", "success");

            setShowLoader(false);

        } catch (error) {

            setShowLoader(false);

            if (error.code === "auth/user-not-found") {
                showAlert("User not found", "error");
            } else {
                showAlert("Failed to send reset email", "error");
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
                    Reset your password
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
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 mb-4 text-sm
          border border-gray-300 dark:border-gray-700
          rounded-md bg-white dark:bg-gray-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Reset Button */}
                {showLoader ? (
                    <div className="flex justify-center items-center w-full py-2">
                        <Box sx={{ display: "flex" }}>
                            <CircularProgress size={20} />
                        </Box>
                    </div>
                ) : (

                    <button
                        onClick={resetPassword}
                        className="w-full cursor-pointer py-2 text-sm
            bg-blue-600 text-white
            rounded-md
            hover:bg-blue-700 transition"
                    >
                        Send reset link
                    </button>
                )}

                {/* Back to login */}
                <p className="text-xs text-center mt-5 text-gray-500">
                    Remember your password?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>

    );
}