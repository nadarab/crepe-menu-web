/**
 * Preload images to cache them in the browser
 * Improves perceived performance by loading critical images early
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images in parallel
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map((url) => preloadImage(url)));
    console.log(`✅ Preloaded ${urls.length} images`);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

/**
 * Preload critical images (backgrounds, logos, first category images)
 */
export const preloadCriticalImages = async (categories: any[]): Promise<void> => {
  const criticalImages = [
    '/images/Section1/hero-background.png',
    '/images/Section1/hero-background-mobile.png',
    '/images/Section1/logo.png',
  ];

  // Add first category's main image
  if (categories.length > 0 && categories[0].mainImage) {
    criticalImages.push(categories[0].mainImage);
  }

  // Add first few item images from first category
  if (categories.length > 0 && categories[0].items) {
    categories[0].items.slice(0, 4).forEach((item: any) => {
      if (item.image) {
        criticalImages.push(item.image);
      }
    });
  }

  await preloadImages(criticalImages);
};
