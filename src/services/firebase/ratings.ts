import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Rating, RatingInput } from '../../types/rating';

const RATINGS_COLLECTION = 'ratings';

/**
 * Submit a new rating
 */
export const submitRating = async (ratingInput: RatingInput): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, RATINGS_COLLECTION), {
      rating: ratingInput.rating,
      feedback: ratingInput.feedback,
      createdAt: Timestamp.now(),
      userAgent: navigator.userAgent,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw new Error('Failed to submit rating');
  }
};

/**
 * Get all ratings (admin only)
 */
export const getAllRatings = async (): Promise<Rating[]> => {
  try {
    const ratingsQuery = query(
      collection(db, RATINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(ratingsQuery);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        rating: data.rating,
        feedback: data.feedback,
        createdAt: data.createdAt?.toDate() || new Date(),
        userAgent: data.userAgent,
      } as Rating;
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw new Error('Failed to fetch ratings');
  }
};

/**
 * Delete a rating (admin only)
 */
export const deleteRating = async (ratingId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, RATINGS_COLLECTION, ratingId));
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw new Error('Failed to delete rating');
  }
};

/**
 * Get rating statistics
 */
export const getRatingStats = async (): Promise<{
  total: number;
  average: number;
  breakdown: { [key: number]: number };
}> => {
  try {
    const ratings = await getAllRatings();
    
    const breakdown: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    
    let totalRating = 0;
    
    ratings.forEach((rating) => {
      breakdown[rating.rating] = (breakdown[rating.rating] || 0) + 1;
      totalRating += rating.rating;
    });
    
    return {
      total: ratings.length,
      average: ratings.length > 0 ? totalRating / ratings.length : 0,
      breakdown,
    };
  } catch (error) {
    console.error('Error calculating rating stats:', error);
    throw new Error('Failed to calculate rating statistics');
  }
};
