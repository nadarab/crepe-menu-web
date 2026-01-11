import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { firestoreService } from '../../services/firebase/firestoreService';
import { storageService } from '../../services/firebase/storageService';
import ItemForm from '../../components/Admin/ItemForm';
import type { Category } from '../../types/category';
import type { MenuItemData } from '../../types/menuItem';

const ItemNew = () => {
  const { t, i18n } = useTranslation();
  const { secret } = useParams<{ secret: string }>();
  const navigate = useNavigate();
  const adminBasePath = `/admin/${secret}`;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextOrder, setNextOrder] = useState<number>(1);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await firestoreService.getCategories();
      setCategories(data);
      
      // Load initial order for first category
      if (data.length > 0) {
        const order = await firestoreService.getNextItemOrder(data[0].id);
        setNextOrder(order);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      const order = await firestoreService.getNextItemOrder(categoryId);
      setNextOrder(order);
    } catch (err: any) {
      console.error('Error getting next order:', err);
      setNextOrder(1);
    }
  };

  const handleSubmit = async (categoryId: string, data: MenuItemData, imageFile?: File) => {
    try {
      setSaving(true);
      setError(null);

      // Get the next order number for this category
      const order = await firestoreService.getNextItemOrder(categoryId);

      let imageUrl = '';

      // If image file is provided, upload it
      if (imageFile) {
        // Create the item to get an ID first
        const itemId = await firestoreService.createItem(categoryId, {
          ...data,
          order, // Use auto-calculated order
          image: '', // Temporary, will update after image upload
        });

        // Upload the image
        const imagePath = storageService.getItemImagePath(itemId, imageFile.name);
        imageUrl = await storageService.uploadImage(imageFile, imagePath);

        // Update item with the image URL
        await firestoreService.updateItem(categoryId, itemId, {
          ...data,
          order, // Ensure order is preserved
          image: imageUrl,
        });
      } else {
        // Create item without image
        await firestoreService.createItem(categoryId, {
          ...data,
          order, // Use auto-calculated order
          image: '', // Empty image URL
        });
      }

      // Navigate back to items list
      navigate(`${adminBasePath}/items`);
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
      console.error('Error creating item:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`${adminBasePath}/items`);
  };

  if (loadingCategories) {
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

  if (categories.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
        <p className="text-yellow-800 font-semibold mb-4">
          {i18n.language === 'ar'
            ? 'يجب إنشاء فئة واحدة على الأقل قبل إضافة العناصر'
            : 'You must create at least one category before adding items'}
        </p>
        <a
          href={`${adminBasePath}/categories/new`}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {i18n.language === 'ar' ? 'إنشاء فئة' : 'Create Category'}
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black">
          {i18n.language === 'ar' ? 'إضافة عنصر جديد' : 'Add New Item'}
        </h2>
        <p className="mt-2 text-gray-700">
          {i18n.language === 'ar'
            ? 'قم بإنشاء عنصر جديد للقائمة'
            : 'Create a new menu item'}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border-2 border-gray-300 shadow p-6">
        <ItemForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onCategoryChange={handleCategoryChange}
          nextOrder={nextOrder}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default ItemNew;

