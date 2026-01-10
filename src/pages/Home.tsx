import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import MenuSection from '../components/Menu/MenuSection';
import MenuSectionReverse from '../components/Menu/MenuSectionReverse';
import { firestoreService } from '../services/firebase/firestoreService';
import type { Category } from '../types/category';

const Home = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryItemPages, setCategoryItemPages] = useState<Record<string, number>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getCategories();
      setCategories(data);
      // Initialize page state for each category
      const initialPages: Record<string, number> = {};
      data.forEach(cat => {
        initialPages[cat.id] = 0;
      });
      setCategoryItemPages(initialPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const setItemPage = (categoryId: string, page: number) => {
    setCategoryItemPages(prev => ({
      ...prev,
      [categoryId]: page
    }));
  };

  if (loading) {
    return (
      <>
        <Hero />
        <section id="menu" className="relative min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-white text-lg">
              {i18n.language === 'ar' ? 'جاري تحميل القائمة...' : 'Loading menu...'}
            </p>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Hero />
        <section id="menu" className="relative min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-xl mb-4">{error}</p>
            <button
              onClick={loadCategories}
              className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
            >
              {i18n.language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        </section>
      </>
    );
  }

  if (categories.length === 0) {
    return (
      <>
        <Hero />
        <section id="menu" className="relative min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-xl">
              {i18n.language === 'ar' ? 'لا توجد عناصر في القائمة' : 'No menu items available'}
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Hero />
      <section 
        id="menu" 
        className="relative bg-[#1a1a1a]"
        style={{
          touchAction: 'pan-y pinch-zoom'
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Backgrounds/BackgroundLap.png"
            alt="Background"
            className="hidden md:block w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <img
            src="/images/Backgrounds/Backgroundphone.png"
            alt="Background"
            className="block md:hidden w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Decorative shapes (fallback) */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 z-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gray-700 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-20 w-96 h-96 bg-gray-800 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content - All Categories Vertically with Alternating Layouts */}
        <div className="relative z-10 py-12">
          {categories.map((category, index) => {
            // Use regular layout for odd indices (0, 2, 4...) and reverse for even indices (1, 3, 5...)
            if (index % 2 === 0) {
              return (
                <MenuSection 
                  key={category.id}
                  categories={[category]}
                  categoryItemPages={categoryItemPages}
                  onSetItemPage={setItemPage}
                />
              );
            } else {
              return (
                <MenuSectionReverse 
                  key={category.id}
                  categories={[category]}
                  categoryItemPages={categoryItemPages}
                  onSetItemPage={setItemPage}
                />
              );
            }
          })}
        </div>
      </section>
    </>
  );
};

export default Home;

