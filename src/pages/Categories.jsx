import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import CategoryCard from "../components/CategoryCard";
import "./Categories.css";

const CATEGORIES = ["Action", "Comedy", "Drama", "Music", "Sports", "Thriller", "Fantasy", "Romance"];

const Categories = () => {
  const setCategories = useStore((state) => state.setCategories);
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [shake, setShake] = useState(false);

  const toggleCategory = (category) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    if (selected.length >= 3) {
      setCategories(selected);
      navigate("/dashboard");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="categories-page" id="categories-page">
      <div className="categories-page__container">
        <div className="categories-page__header">
          <h1 className="categories-page__title">Choose your interests</h1>
          <p className="categories-page__subtitle">
            Select at least <strong>3 categories</strong> to personalize your dashboard
          </p>
          <div className="categories-page__progress">
            <div
              className="categories-page__progress-bar"
              style={{ width: `${Math.min((selected.length / 3) * 100, 100)}%` }}
            />
          </div>
          <span className="categories-page__count">
            {selected.length} of 3 minimum selected
            {selected.length >= 3 && " ✓"}
          </span>
        </div>

        <div className="categories-page__grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              isSelected={selected.includes(cat)}
              onToggle={() => toggleCategory(cat)}
            />
          ))}
        </div>

        <button
          className={`categories-page__btn ${
            selected.length < 3 ? "categories-page__btn--disabled" : ""
          } ${shake ? "categories-page__btn--shake" : ""}`}
          onClick={handleContinue}
          id="categories-continue-btn"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Categories;
