import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const setUser = useStore((state) => state.setUser);
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const [mode, setMode] = useState("signup"); // "signup" or "login"
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign Up fields
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    checkbox: false,
  });

  // Login fields
  const [loginData, setLoginData] = useState({
    username: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // ─── Sign Up Validation ───
  const validateSignup = () => {
    const tempErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    const usernamePattern = /^[a-zA-Z0-9]+$/;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required.";
    } else if (!namePattern.test(formData.name.trim())) {
      tempErrors.name = "Name must contain only alphabetic characters.";
    }

    if (!formData.username.trim()) {
      tempErrors.username = "Username is required.";
    } else if (!usernamePattern.test(formData.username.trim())) {
      tempErrors.username = "Username must be alphanumeric with no spaces.";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!formData.mobile.trim()) {
      tempErrors.mobile = "Mobile number is required.";
    } else if (!phonePattern.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (!formData.checkbox) {
      tempErrors.checkbox = "Check this box to proceed.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ─── Login Validation ───
  const validateLogin = () => {
    const tempErrors = {};

    if (!loginData.username.trim()) {
      tempErrors.loginUsername = "Username is required.";
    }
    if (!loginData.email.trim()) {
      tempErrors.loginEmail = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      tempErrors.loginEmail = "Please enter a valid email address.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLoginChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    const errorKey = field === "username" ? "loginUsername" : "loginEmail";
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  // ─── Sign Up Submit ───
  const handleSignup = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setUser(formData);
        navigate("/categories");
      }, 600);
    }
  };

  // ─── Login Submit ───
  const handleLogin = (e) => {
    e.preventDefault();
    if (validateLogin()) {
      setIsSubmitting(true);
      const result = login(loginData.username, loginData.email);
      setTimeout(() => {
        setIsSubmitting(false);
        if (result.success) {
          if (result.categoriesSelected) {
            navigate("/dashboard");
          } else {
            navigate("/categories");
          }
        } else {
          setErrors({ loginGeneral: result.error });
        }
      }, 600);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <div className="reg-form" id="registration-form">
      {/* Tab Switcher */}
      <div className="reg-form__tabs">
        <button
          className={`reg-form__tab ${mode === "signup" ? "reg-form__tab--active" : ""}`}
          onClick={() => switchMode("signup")}
          type="button"
        >
          Sign Up
        </button>
        <button
          className={`reg-form__tab ${mode === "login" ? "reg-form__tab--active" : ""}`}
          onClick={() => switchMode("login")}
          type="button"
        >
          Log In
        </button>
      </div>

      <div className="reg-form__header">
        <h1 className="reg-form__title">Super App</h1>
        <p className="reg-form__subtitle">
          {mode === "signup" ? "Create your account" : "Welcome back! Log in to continue"}
        </p>
      </div>

      {/* ─── SIGN UP FORM ─── */}
      {mode === "signup" && (
        <form onSubmit={handleSignup}>
          <div className="reg-form__fields">
            <div className={`reg-form__group ${errors.name ? "reg-form__group--error" : ""}`}>
              <input
                id="reg-name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="reg-form__input"
              />
              {errors.name && <span className="reg-form__error">{errors.name}</span>}
            </div>

            <div className={`reg-form__group ${errors.username ? "reg-form__group--error" : ""}`}>
              <input
                id="reg-username"
                type="text"
                placeholder="UserName"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="reg-form__input"
              />
              {errors.username && <span className="reg-form__error">{errors.username}</span>}
            </div>

            <div className={`reg-form__group ${errors.email ? "reg-form__group--error" : ""}`}>
              <input
                id="reg-email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="reg-form__input"
              />
              {errors.email && <span className="reg-form__error">{errors.email}</span>}
            </div>

            <div className={`reg-form__group ${errors.mobile ? "reg-form__group--error" : ""}`}>
              <input
                id="reg-mobile"
                type="text"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                className="reg-form__input"
                maxLength={10}
              />
              {errors.mobile && <span className="reg-form__error">{errors.mobile}</span>}
            </div>

            {/* Checkbox Group */}
            <div className={`reg-form__group reg-form__group--checkbox ${errors.checkbox ? "reg-form__group--error" : ""}`}>
              <label className="reg-form__checkbox-label">
                <input
                  id="reg-checkbox"
                  type="checkbox"
                  checked={formData.checkbox}
                  onChange={(e) => handleChange("checkbox", e.target.checked)}
                  className="reg-form__checkbox"
                />
                <span className="reg-form__checkbox-text">
                  Share my registration data with Superapp
                </span>
              </label>
              {errors.checkbox && <span className="reg-form__error">{errors.checkbox}</span>}
            </div>
          </div>

          <button
            type="submit"
            className={`reg-form__submit ${isSubmitting ? "reg-form__submit--loading" : ""}`}
            id="reg-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="reg-form__spinner"></span> : "Sign Up"}
          </button>

          <p className="reg-form__footer">
            By clicking on Sign up, you agree to Super App's{" "}
            <a href="#" className="reg-form__link">Terms and Conditions of Use</a>
          </p>
          <p className="reg-form__footer">
            To learn more about how Super App collects, uses, shares and protects your personal data, please head to Super App's{" "}
            <a href="#" className="reg-form__link">Privacy Policy</a>
          </p>
        </form>
      )}

      {/* ─── LOGIN FORM ─── */}
      {mode === "login" && (
        <form onSubmit={handleLogin}>
          <div className="reg-form__fields">
            {errors.loginGeneral && (
              <div className="reg-form__general-error">
                <span className="reg-form__general-error-icon">⚠️</span>
                {errors.loginGeneral}
              </div>
            )}

            <div className={`reg-form__group ${errors.loginUsername ? "reg-form__group--error" : ""}`}>
              <input
                id="login-username"
                type="text"
                placeholder="UserName"
                value={loginData.username}
                onChange={(e) => handleLoginChange("username", e.target.value)}
                className="reg-form__input"
              />
              {errors.loginUsername && <span className="reg-form__error">{errors.loginUsername}</span>}
            </div>

            <div className={`reg-form__group ${errors.loginEmail ? "reg-form__group--error" : ""}`}>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => handleLoginChange("email", e.target.value)}
                className="reg-form__input"
              />
              {errors.loginEmail && <span className="reg-form__error">{errors.loginEmail}</span>}
            </div>
          </div>

          <button
            type="submit"
            className={`reg-form__submit ${isSubmitting ? "reg-form__submit--loading" : ""}`}
            id="login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="reg-form__spinner"></span> : "Log In"}
          </button>

          <p className="reg-form__footer reg-form__footer--center">
            Don't have an account?{" "}
            <button type="button" className="reg-form__link reg-form__link--btn" onClick={() => switchMode("signup")}>
              Sign up here
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
