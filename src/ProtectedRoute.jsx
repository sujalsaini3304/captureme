// import { useAuth } from "@clerk/clerk-react";
// import { Navigate, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const { isSignedIn, isLoaded } = useAuth();
//   const location = useLocation();

//   if (!isLoaded) return null;

//   if (!isSignedIn) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;



// Firebase logic 
// import { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase.config";

// const ProtectedRoute = ({ children }) => {

//   const [user, setUser] = useState(undefined);
//   const location = useLocation();

//   useEffect(() => {

//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();

//   }, []);

//   // Auth still loading
//   if (user === undefined) return null;

//   // Not logged in
//   if (!user) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   // Logged in
//   return children;
// };

// export default ProtectedRoute;





import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user }) => {
  const hasPasswordProvider = user?.providerData?.some(
    (provider) => provider.providerId === "password"
  );
  const isVerifiedPasswordUser = !hasPasswordProvider || user?.emailVerified;

  if (!user || !isVerifiedPasswordUser) {
    return <Navigate to="/login" replace />;
  }

  return children;

};

export default ProtectedRoute;