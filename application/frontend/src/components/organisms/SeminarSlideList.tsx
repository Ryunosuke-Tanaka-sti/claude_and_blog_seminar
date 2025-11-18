import React from 'react';
import SeminarSlideCard from '../molecules/SeminarSlideCard';
import type { SeminarSlide } from '../../types/seminarSlide';
import './SeminarSlideList.css';

interface SeminarSlideListProps {
  slides: SeminarSlide[];
}

const SeminarSlideList: React.FC<SeminarSlideListProps> = ({ slides }) => {
  if (!slides || slides.length === 0) {
    return (
      <div className="seminar-slide-list">
        <div className="empty-state">
          <p>現在、公開中のセミナースライドはありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seminar-slide-list">
      <div className="list-header">
        <h2 className="list-title">技術セミナースライド</h2>
        <p className="list-description">
          Claudeを活用した技術ブログ執筆やAI開発手法について学べるセミナー資料です。
          各スライドをクリックすると、プレゼンテーション形式で閲覧できます。
        </p>
      </div>

      <div className="slide-grid">
        {slides.map((slide) => (
          <SeminarSlideCard key={slide.id} slide={slide} />
        ))}
      </div>
    </div>
  );
};

export default SeminarSlideList;
