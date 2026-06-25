import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const ProtectedRoute = ({ children, requireRegistration, requireCategories }) => {
  const isRegistered = useStore((s) => s.isRegistered);
  const categoriesSelected = useStore((s) => s.categoriesSelected);

  if (requireRegistration && !isRegistered) {
    return <Navigate to="/" replace />;
  }
  if (requireCategories && !categoriesSelected) {
    return <Navigate to="/categories" replace />;
  }

  return children;
};

export default ProtectedRoute;
