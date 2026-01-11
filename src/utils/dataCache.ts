import type { Category } from '../types/category';

/**
 * In-memory cache for categories data
 * Reduces redundant Firestore queries
 */
class DataCache {
  private categories: Category[] | null = null;
  private categoriesTimestamp: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached categories if available and not expired
   */
  getCategories(): Category[] | null {
    if (!this.categories || !this.categoriesTimestamp) {
      return null;
    }

    const now = Date.now();
    if (now - this.categoriesTimestamp > this.CACHE_DURATION) {
      // Cache expired
      this.clearCategories();
      return null;
    }

    return this.categories;
  }

  /**
   * Set categories cache
   */
  setCategories(categories: Category[]): void {
    this.categories = categories;
    this.categoriesTimestamp = Date.now();
  }

  /**
   * Clear categories cache
   */
  clearCategories(): void {
    this.categories = null;
    this.categoriesTimestamp = null;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.clearCategories();
  }
}

// Export singleton instance
export const dataCache = new DataCache();
