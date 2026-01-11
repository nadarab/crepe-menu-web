import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { firestoreService } from '../../services/firebase/firestoreService';
import { storageService } from '../../services/firebase/storageService';
import type { Category } from '../../types/category';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const { secret } = useParams<{ secret: string }>();
  const adminBasePath = `/admin/${secret}`;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(i18n.language === 'ar' 
      ? `هل أنت متأكد من حذف "${category.title[i18n.language as 'en' | 'ar']}"؟`
      : `Are you sure you want to delete "${category.title[i18n.language as 'en' | 'ar']}"?`
    )) {
      return;
    }

    try {
      setDeletingId(category.id);
      
      // Delete the main image from storage if it exists
      if (category.mainImage) {
        try {
          await storageService.deleteImage(category.mainImage);
        } catch (imgErr) {
          console.warn('Error deleting image:', imgErr);
          // Continue even if image deletion fails
        }
      }

      // Delete the category (this will also delete all items)
      await firestoreService.deleteCategory(category.id);
      
      // Reload categories
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase();
    const titleEn = category.title.en.toLowerCase();
    const titleAr = category.title.ar.toLowerCase();
    const descEn = category.description.en.toLowerCase();
    const descAr = category.description.ar.toLowerCase();
    
    return (
      titleEn.includes(searchLower) ||
      titleAr.includes(searchLower) ||
      descEn.includes(searchLower) ||
      descAr.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-black">
            {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
        <p className="text-red-800 font-semibold">{error}</p>
        <button
          onClick={loadCategories}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          {i18n.language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">
          {i18n.language === 'ar' ? 'الفئات' : 'Categories'}
        </h2>
        <Link
          to={`${adminBasePath}/categories/new`}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {i18n.language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category'}
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={i18n.language === 'ar' ? 'بحث...' : 'Search...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
        />
      </div>

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-gray-300 shadow p-8 text-center">
          <p className="text-black text-lg">
            {searchTerm
              ? i18n.language === 'ar'
                ? 'لا توجد نتائج'
                : 'No results found'
              : i18n.language === 'ar'
              ? 'لا توجد فئات حتى الآن'
              : 'No categories yet'}
          </p>
          {!searchTerm && (
            <Link
              to={`${adminBasePath}/categories/new`}
              className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {i18n.language === 'ar' ? 'إنشاء أول فئة' : 'Create First Category'}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border-2 border-gray-300 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="h-48 bg-gray-200 relative">
                {category.mainImage ? (
                  <img
                    src={category.mainImage}
                    alt={category.title[i18n.language as 'en' | 'ar']}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-sm font-semibold">
                  #{category.order}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-black mb-2">
                  {category.title[i18n.language as 'en' | 'ar']}
                </h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {category.description[i18n.language as 'en' | 'ar']}
                </p>
                
                <div className="text-sm text-gray-600 mb-4">
                  {category.items?.length || 0}{' '}
                  {i18n.language === 'ar' ? 'عنصر' : 'items'}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`${adminBasePath}/categories/${category.id}/edit`}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-center text-sm font-semibold"
                  >
                    {i18n.language === 'ar' ? 'تعديل' : 'Edit'}
                  </Link>
                  <button
                    onClick={() => handleDelete(category)}
                    disabled={deletingId === category.id}
                    className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === category.id
                      ? i18n.language === 'ar'
                        ? 'جاري الحذف...'
                        : 'Deleting...'
                      : i18n.language === 'ar'
                      ? 'حذف'
                      : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

