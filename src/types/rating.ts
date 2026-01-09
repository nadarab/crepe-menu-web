/**
 * Rating submission type
 */
export interface Rating {
  id: string;
  rating: number; // 1-5 stars
  feedback: string;
  createdAt: Date;
  userAgent?: string; // Optional: browser info
}

/**
 * Rating input type (before saving to Firebase)
 */
export interface RatingInput {
  rating: number;
  feedback: string;
}
