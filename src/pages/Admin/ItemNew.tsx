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

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await firestoreService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (categoryId: string, data: MenuItemData, imageFile?: File) => {
    if (!imageFile) {
      setError('Image is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Create the item to get an ID
      const itemId = await firestoreService.createItem(categoryId, {
        ...data,
        image: '', // Temporary, will update after image upload
      });

      // Upload the image
      const imagePath = storageService.getItemImagePath(itemId, imageFile.name);
      const imageUrl = await storageService.uploadImage(imageFile, imagePath);

      // Update item with the image URL
      await firestoreService.updateItem(categoryId, itemId, {
        ...data,
        image: imageUrl,
      });

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800 mb-4">
          {i18n.language === 'ar'
            ? 'يجب إنشاء فئة واحدة على الأقل قبل إضافة العناصر'
            : 'You must create at least one category before adding items'}
        </p>
        <a
          href={`${adminBasePath}/categories/new`}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {i18n.language === 'ar' ? 'إنشاء فئة' : 'Create Category'}
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {i18n.language === 'ar' ? 'إضافة عنصر جديد' : 'Add New Item'}
        </h2>
        <p className="mt-2 text-gray-600">
          {i18n.language === 'ar'
            ? 'قم بإنشاء عنصر جديد للقائمة'
            : 'Create a new menu item'}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <ItemForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default ItemNew;

