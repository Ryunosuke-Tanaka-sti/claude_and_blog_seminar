export interface SeminarSlide {
  // 必須項目
  id: string;
  title: string;
  url: string;
  description: string;

  // 任意項目
  thumbnail?: string;
  targetAudience?: string[];
  theme?: 'canyon-custom' | 'github-dark';
  slideCount?: number;
  categories?: string[];
  createdAt?: string;
  updatedAt?: string;
}
