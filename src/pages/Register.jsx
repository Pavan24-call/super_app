import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import RegistrationForm from "../components/RegistrationForm";
import "./Register.css";

const Register = () => {
  const isRegistered = useStore((s) => s.isRegistered);
  const categoriesSelected = useStore((s) => s.categoriesSelected);

  // Auto-redirect if user is already logged in
  if (isRegistered && categoriesSelected) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isRegistered && !categoriesSelected) {
    return <Navigate to="/categories" replace />;
  }

  return (
    <div className="register-page" id="register-page">
      <div className="register-page__left">
        <RegistrationForm />
      </div>
      <div className="register-page__right">
        <div className="register-page__art">
          <div className="register-page__orb register-page__orb--1"></div>
          <div className="register-page__orb register-page__orb--2"></div>
          <div className="register-page__orb register-page__orb--3"></div>
          <div className="register-page__hero-text">
            <h2>Discover new things on<br/>all platforms</h2>
            <p>One dashboard to rule them all — weather, news, notes, timers, and entertainment in one place.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
