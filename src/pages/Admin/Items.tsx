import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { firestoreService } from '../../services/firebase/firestoreService';
import { storageService } from '../../services/firebase/storageService';
import type { Category } from '../../types/category';
import type { MenuItem } from '../../types/menuItem';

const Items = () => {
  const { i18n } = useTranslation();
  const { secret } = useParams<{ secret: string }>();
  const adminBasePath = `/admin/${secret}`;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<{ categoryId: string; itemId: string } | null>(null);

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
      setError(err.message || 'Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, item: MenuItem) => {
    if (!confirm(i18n.language === 'ar'
      ? `هل أنت متأكد من حذف "${item.name[i18n.language as 'en' | 'ar']}"؟`
      : `Are you sure you want to delete "${item.name[i18n.language as 'en' | 'ar']}"?`
    )) {
      return;
    }

    try {
      setDeletingId({ categoryId, itemId: item.id });

      // Delete the image from storage if it exists
      if (item.image) {
        try {
          await storageService.deleteImage(item.image);
        } catch (imgErr) {
          console.warn('Error deleting image:', imgErr);
        }
      }

      // Delete the item
      await firestoreService.deleteItem(categoryId, item.id);

      // Reload categories
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
      console.error('Error deleting item:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Get all items from all categories
  const allItems = categories.flatMap((category) =>
    (category.items || []).map((item) => ({ ...item, categoryId: category.id, category }))
  );

  // Filter items
  const filteredItems = allItems.filter((item) => {
    // Filter by category
    if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameEn = item.name.en.toLowerCase();
      const nameAr = item.name.ar.toLowerCase();
      return nameEn.includes(searchLower) || nameAr.includes(searchLower);
    }

    return true;
  });

  // Sort by category order, then by item order
  filteredItems.sort((a, b) => {
    if (a.category.order !== b.category.order) {
      return a.category.order - b.category.order;
    }
    return a.order - b.order;
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
          {i18n.language === 'ar' ? 'العناصر' : 'Items'}
        </h2>
        <Link
          to={`${adminBasePath}/items/new`}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {i18n.language === 'ar' ? 'إضافة عنصر جديد' : 'Add New Item'}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        {/* Category Filter */}
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
        >
          <option value="all">
            {i18n.language === 'ar' ? 'جميع الفئات' : 'All Categories'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title[i18n.language as 'en' | 'ar']}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder={i18n.language === 'ar' ? 'بحث...' : 'Search...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
        />
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-gray-300 shadow p-8 text-center">
          <p className="text-black text-lg">
            {searchTerm || selectedCategoryId !== 'all'
              ? i18n.language === 'ar'
                ? 'لا توجد نتائج'
                : 'No results found'
              : i18n.language === 'ar'
              ? 'لا توجد عناصر حتى الآن'
              : 'No items yet'}
          </p>
          {!searchTerm && selectedCategoryId === 'all' && (
            <Link
              to={`${adminBasePath}/items/new`}
              className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {i18n.language === 'ar' ? 'إنشاء أول عنصر' : 'Create First Item'}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group by category */}
          {categories
            .filter((category) => {
              if (selectedCategoryId !== 'all') {
                return category.id === selectedCategoryId;
              }
              return filteredItems.some((item) => item.categoryId === category.id);
            })
            .map((category) => {
              const categoryItems = filteredItems.filter((item) => item.categoryId === category.id);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id} className="bg-white rounded-lg border-2 border-gray-300 shadow-md p-6">
                  <h3 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-gray-300">
                    {category.title[i18n.language as 'en' | 'ar']}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Image */}
                        <div className="h-40 bg-gray-200 relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name[i18n.language as 'en' | 'ar']}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-xs font-semibold">
                            #{item.order}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-semibold text-black mb-1">
                            {item.name[i18n.language as 'en' | 'ar']}
                          </h4>
                          {item.price !== undefined && (
                            <p className="text-black font-bold mb-3">
                              {item.price} JD
                            </p>
                          )}
                          
                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              to={`${adminBasePath}/items/${category.id}/${item.id}/edit`}
                              className="flex-1 px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-center text-sm font-semibold"
                            >
                              {i18n.language === 'ar' ? 'تعديل' : 'Edit'}
                            </Link>
                            <button
                              onClick={() => handleDelete(category.id, item)}
                              disabled={
                                deletingId?.categoryId === category.id &&
                                deletingId?.itemId === item.id
                              }
                              className="px-3 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId?.categoryId === category.id && deletingId?.itemId === item.id
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
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Items;

