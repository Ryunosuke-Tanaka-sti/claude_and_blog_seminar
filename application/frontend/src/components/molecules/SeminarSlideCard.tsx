import React from 'react';
import type { SeminarSlide } from '../../types/seminarSlide';
import './SeminarSlideCard.css';

interface SeminarSlideCardProps {
  slide: SeminarSlide;
}

const SeminarSlideCard: React.FC<SeminarSlideCardProps> = ({ slide }) => {
  return (
    <a
      href={slide.url}
      target="_blank"
      rel="noopener noreferrer"
      className="seminar-slide-card"
      aria-label={`${slide.title} - ${slide.description}`}
    >
      {slide.thumbnail && (
        <div className="card-thumbnail">
          <img src={slide.thumbnail} alt={slide.title} loading="lazy" />
        </div>
      )}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{slide.title}</h3>
          {slide.theme && (
            <span className={`theme-badge theme-${slide.theme}`}>
              {slide.theme === 'github-dark' ? 'Dark' : 'Bright'}
            </span>
          )}
        </div>

        <p className="card-description">{slide.description}</p>

        {slide.targetAudience && slide.targetAudience.length > 0 && (
          <div className="card-audience">
            <span className="audience-label">対象者:</span>
            <span className="audience-text">{slide.targetAudience.join(', ')}</span>
          </div>
        )}

        {slide.categories && slide.categories.length > 0 && (
          <div className="card-tags">
            {slide.categories.map((category, index) => (
              <span key={index} className="tag">
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};

export default SeminarSlideCard;
