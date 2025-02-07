import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const isAuthenticated = token;
  if (!isAuthenticated) return <Navigate to={"/"} replace />;
  else return children;
};

export default ProtectedRoute;
