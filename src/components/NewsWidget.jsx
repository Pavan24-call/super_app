import React, { useEffect, useState, useRef } from "react";
import { fetchTopHeadlines } from "../services/api";
import "./NewsWidget.css";

const FALLBACK_NEWS = [
  {
    title: "Technology continues to transform how we work and live",
    description: "From AI-powered tools to sustainable tech, 2026 has been a year of rapid innovation across multiple sectors.",
    source: { name: "Tech Daily" },
    urlToImage: null,
  },
  {
    title: "Global markets show steady growth in Q2 2026",
    description: "Economic indicators suggest a robust recovery across major economies, with job creation exceeding forecasts.",
    source: { name: "Finance Hub" },
    urlToImage: null,
  },
  {
    title: "New breakthroughs in renewable energy announced",
    description: "Scientists have developed more efficient solar panels that could reduce energy costs significantly.",
    source: { name: "Green World" },
    urlToImage: null,
  },
  {
    title: "Space exploration reaches new milestones",
    description: "Multiple agencies announce plans for lunar base construction, with initial modules set for deployment.",
    source: { name: "Space News" },
    urlToImage: null,
  },
  {
    title: "Health researchers make progress on personalized medicine",
    description: "Advances in genomics are enabling treatments tailored to individual patients, improving outcomes.",
    source: { name: "Health Today" },
    urlToImage: null,
  },
];

const NewsWidget = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const getNews = async () => {
      try {
        setLoading(true);
        const data = await fetchTopHeadlines();
        if (cancelled) return;
        const filtered = data.filter((a) => a.title && a.title !== "[Removed]");
        if (filtered.length > 0) {
          setArticles(filtered.slice(0, 10));
        } else {
          setArticles(FALLBACK_NEWS);
        }
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("News fetch error, using fallback:", err);
        setArticles(FALLBACK_NEWS);
        setError(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    getNews();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (articles.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
      }, 2000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [articles]);

  if (loading) {
    return (
      <div className="news-widget news-widget--loading" id="news-widget">
        <div className="news-widget__skeleton">
          <div className="skeleton-pulse skeleton-line" style={{ width: "90%" }}></div>
          <div className="skeleton-pulse skeleton-line" style={{ width: "70%" }}></div>
          <div className="skeleton-pulse skeleton-line" style={{ width: "50%" }}></div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="news-widget news-widget--error" id="news-widget">
        <span>📰</span>
        <p>No news available</p>
      </div>
    );
  }

  const article = articles[currentIndex];

  return (
    <div className="news-widget" id="news-widget">
      <div className="news-widget__header">
        <h3 className="news-widget__title">📰 Top Headlines</h3>
        <span className="news-widget__counter">
          {currentIndex + 1}/{articles.length}
        </span>
      </div>

      <div className="news-widget__article" key={currentIndex}>
        {article.urlToImage && (
          <div className="news-widget__image-wrap">
            <img
              src={article.urlToImage}
              alt=""
              className="news-widget__image"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}
        <h4 className="news-widget__headline">{article.title}</h4>
        <p className="news-widget__desc">{article.description}</p>
        <div className="news-widget__meta">
          <span className="news-widget__source">{article.source?.name}</span>
        </div>
      </div>

      <div className="news-widget__dots">
        {articles.map((_, i) => (
          <span
            key={i}
            className={`news-widget__dot ${i === currentIndex ? "news-widget__dot--active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsWidget;
