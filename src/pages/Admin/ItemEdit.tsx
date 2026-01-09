import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { firestoreService } from '../../services/firebase/firestoreService';
import { storageService } from '../../services/firebase/storageService';
import ItemForm from '../../components/Admin/ItemForm';
import type { Category } from '../../types/category';
import type { MenuItem, MenuItemData } from '../../types/menuItem';

const ItemEdit = () => {
  const { t, i18n } = useTranslation();
  const { secret, categoryId, id } = useParams<{ secret: string; categoryId: string; id: string }>();
  const navigate = useNavigate();
  const adminBasePath = `/admin/${secret}`;

  const [categories, setCategories] = useState<Category[]>([]);
  const [item, setItem] = useState<(MenuItem & { categoryId: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId && id) {
      loadData();
    }
  }, [categoryId, id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories and the specific category with item
      const [categoriesData, category] = await Promise.all([
        firestoreService.getCategories(),
        firestoreService.getCategory(categoryId!),
      ]);

      setCategories(categoriesData);

      if (!category) {
        setError('Category not found');
        return;
      }

      const foundItem = category.items?.find((i) => i.id === id);
      if (!foundItem) {
        setError('Item not found');
        return;
      }

      setItem({ ...foundItem, categoryId: category.id });
    } catch (err: any) {
      setError(err.message || 'Failed to load item');
      console.error('Error loading item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    newCategoryId: string,
    data: MenuItemData,
    imageFile?: File
  ) => {
    if (!categoryId || !id || !item) return;

    try {
      setSaving(true);
      setError(null);

      let imageUrl = data.image;

      // If a new image file is provided, upload it
      if (imageFile) {
        // Delete old image if it exists
        if (item.image) {
          try {
            await storageService.deleteImage(item.image);
          } catch (imgErr) {
            console.warn('Error deleting old image:', imgErr);
          }
        }

        // Upload new image
        const imagePath = storageService.getItemImagePath(id, imageFile.name);
        imageUrl = await storageService.uploadImage(imageFile, imagePath);
      }

      // If category changed, we need to move the item
      if (newCategoryId !== categoryId) {
        // Create item in new category
        await firestoreService.createItem(newCategoryId, {
          ...data,
          image: imageUrl,
        });
        // Delete from old category
        await firestoreService.deleteItem(categoryId, id);
      } else {
        // Update item in same category
        await firestoreService.updateItem(categoryId, id, {
          ...data,
          image: imageUrl,
        });
      }

      // Navigate back to items list
      navigate(`${adminBasePath}/items`);
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
      console.error('Error updating item:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`${adminBasePath}/items`);
  };

  if (loading) {
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

  if (error && !item) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={handleCancel}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {i18n.language === 'ar' ? 'العودة' : 'Go Back'}
        </button>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {i18n.language === 'ar' ? 'تعديل العنصر' : 'Edit Item'}
        </h2>
        <p className="mt-2 text-gray-600">
          {i18n.language === 'ar'
            ? 'قم بتحديث معلومات العنصر'
            : 'Update item information'}
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
          initialData={item}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default ItemEdit;

