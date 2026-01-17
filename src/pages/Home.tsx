import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MenuSection from '../components/Menu/MenuSection';
import MenuSectionReverse from '../components/Menu/MenuSectionReverse';
import ContactUs from '../components/ContactUs';
import { firestoreService } from '../services/firebase/firestoreService';
import type { Category } from '../types/category';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryItemPages, setCategoryItemPages] = useState<Record<string, number>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await firestoreService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetItemPage = (categoryId: string, page: number) => {
    setCategoryItemPages(prev => ({
      ...prev,
      [categoryId]: page
    }));
  };

  // Group categories by layout type while maintaining order
  // This approach renders in batches for better performance while preserving alternating layout
  const renderCategories = () => {
    const elements: React.ReactElement[] = [];
    let currentBatch: Category[] = [];
    let currentType: 'odd' | 'even' | null = null;

    categories.forEach((category, index) => {
      const numericId = !isNaN(Number(category.id)) ? Number(category.id) : category.order;
      const isOddId = numericId % 2 !== 0;
      const type = isOddId ? 'odd' : 'even';

      // If type changes or it's the last category, render the current batch
      if (currentType !== null && currentType !== type) {
        // Render the batch
        if (currentType === 'odd') {
          elements.push(
            <MenuSection
              key={`batch-${elements.length}`}
              categories={currentBatch}
              categoryItemPages={categoryItemPages}
              onSetItemPage={handleSetItemPage}
            />
          );
        } else {
          elements.push(
            <MenuSectionReverse
              key={`batch-${elements.length}`}
              categories={currentBatch}
              categoryItemPages={categoryItemPages}
              onSetItemPage={handleSetItemPage}
            />
          );
        }
        // Start new batch
        currentBatch = [category];
        currentType = type;
      } else {
        // Add to current batch
        currentBatch.push(category);
        currentType = type;
      }

      // Handle last category
      if (index === categories.length - 1) {
        if (currentType === 'odd') {
          elements.push(
            <MenuSection
              key={`batch-${elements.length}`}
              categories={currentBatch}
              categoryItemPages={categoryItemPages}
              onSetItemPage={handleSetItemPage}
            />
          );
        } else {
          elements.push(
            <MenuSectionReverse
              key={`batch-${elements.length}`}
              categories={currentBatch}
              categoryItemPages={categoryItemPages}
              onSetItemPage={handleSetItemPage}
            />
          );
        }
      }
    });

    return elements;
  };

  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <Hero />

      {/* Menu Sections Container - Single shared background on mobile/tablet */}
      <div className="relative">
        {/* Mobile/Tablet: Single shared background for all menu categories */}
        <div className="lg:hidden absolute inset-0 z-0">
          <img
            src="/images/Backgrounds/Backgroundphone.png"
            alt="Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Menu Sections - Alternating based on category ID, batched for performance */}
        {renderCategories()}
      </div>

    </div>
  );
};

export default Home;
