import { useState, useEffect } from 'react';
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

  // Split categories into two groups: odd and even indexed
  const oddCategories = categories.filter((_, index) => index % 2 === 0);
  const evenCategories = categories.filter((_, index) => index % 2 !== 0);

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

        {/* Menu Sections - Alternating normal and reverse */}
        <MenuSection
          categories={oddCategories}
          categoryItemPages={categoryItemPages}
          onSetItemPage={handleSetItemPage}
        />

        <MenuSectionReverse
          categories={evenCategories}
          categoryItemPages={categoryItemPages}
          onSetItemPage={handleSetItemPage}
        />
      </div>

    </div>
  );
};

export default Home;
