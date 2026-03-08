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