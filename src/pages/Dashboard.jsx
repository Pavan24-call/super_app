import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import WeatherWidget from "../components/WeatherWidget";
import NewsWidget from "../components/NewsWidget";
import TimerWidget from "../components/TimerWidget";
import NotesWidget from "../components/NotesWidget";
import "./Dashboard.css";

const Dashboard = () => {
  const user = useStore((state) => state.user);
  const categories = useStore((state) => state.categories);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page" id="dashboard-page">
      <header className="dashboard-page__header">
        <h1 className="dashboard-page__logo">Super App</h1>
        <nav className="dashboard-page__nav">
          <button
            onClick={() => navigate("/movies")}
            className="dashboard-page__nav-btn"
            id="nav-movies-btn"
          >
            🎬 Entertainment
          </button>
          <button
            onClick={handleLogout}
            className="dashboard-page__nav-btn dashboard-page__nav-btn--logout"
            id="nav-logout-btn"
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="dashboard-page__grid">
        {/* User Profile Widget */}
        <div className="dashboard-widget dashboard-widget--profile" id="profile-widget">
          <div className="profile-widget__avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="profile-widget__name">{user.name}</h2>
          <p className="profile-widget__username">@{user.username}</p>

          <div className="profile-widget__details">
            <div className="profile-widget__detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 7l-10 7L2 7"/>
              </svg>
              <span>{user.email}</span>
            </div>
            <div className="profile-widget__detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span>{user.mobile}</span>
            </div>
          </div>

          <div className="profile-widget__categories">
            <h4 className="profile-widget__cat-title">Your Interests</h4>
            <div className="profile-widget__chips">
              {categories.map((cat) => (
                <span key={cat} className="profile-widget__chip">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="dashboard-widget dashboard-widget--weather">
          <WeatherWidget />
        </div>

        {/* News Widget */}
        <div className="dashboard-widget dashboard-widget--news">
          <NewsWidget />
        </div>

        {/* Timer Widget */}
        <div className="dashboard-widget dashboard-widget--timer">
          <TimerWidget />
        </div>

        {/* Notes Widget */}
        <div className="dashboard-widget dashboard-widget--notes">
          <NotesWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
