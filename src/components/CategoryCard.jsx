import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category, isSelected, onToggle }) => {
  const categoryData = {
    Action: { emoji: "💥", gradient: "linear-gradient(135deg, #ff4500, #cc3700)" },
    Comedy: { emoji: "😂", gradient: "linear-gradient(135deg, #ffd700, #ff8c00)" },
    Drama: { emoji: "🎭", gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)" },
    Music: { emoji: "🎵", gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" },
    Sports: { emoji: "⚽", gradient: "linear-gradient(135deg, #10b981, #059669)" },
    Thriller: { emoji: "🔪", gradient: "linear-gradient(135deg, #ef4444, #991b1b)" },
    Fantasy: { emoji: "🧙", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)" },
    Romance: { emoji: "💕", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
  };

  const data = categoryData[category] || { emoji: "🎬", gradient: "linear-gradient(135deg, #666, #444)" };

  return (
    <div
      className={`cat-card ${isSelected ? "cat-card--selected" : ""}`}
      onClick={onToggle}
      style={{ background: data.gradient }}
      id={`category-card-${category.toLowerCase()}`}
    >
      <div className="cat-card__content">
        <span className="cat-card__emoji">{data.emoji}</span>
        <span className="cat-card__label">{category}</span>
      </div>
      {isSelected && (
        <div className="cat-card__check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div className="cat-card__overlay"></div>
    </div>
  );
};

export default CategoryCard;
