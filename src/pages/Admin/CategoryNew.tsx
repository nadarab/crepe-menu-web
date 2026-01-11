import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { firestoreService } from '../../services/firebase/firestoreService';
import { storageService } from '../../services/firebase/storageService';
import CategoryForm from '../../components/Admin/CategoryForm';
import type { CategoryData } from '../../types/category';

const CategoryNew = () => {
  const { t, i18n } = useTranslation();
  const { secret } = useParams<{ secret: string }>();
  const navigate = useNavigate();
  const adminBasePath = `/admin/${secret}`;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextOrder, setNextOrder] = useState<number>(1);

  useEffect(() => {
    loadNextOrder();
  }, []);

  const loadNextOrder = async () => {
    try {
      const order = await firestoreService.getNextCategoryOrder();
      setNextOrder(order);
    } catch (err: any) {
      console.error('Error getting next order:', err);
      setNextOrder(1);
    }
  };

  const handleSubmit = async (data: CategoryData, imageFile?: File) => {
    try {
      setSaving(true);
      setError(null);

      // Get the next order number
      const order = await firestoreService.getNextCategoryOrder();

      let imageUrl = '';

      // If image file is provided, upload it
      if (imageFile) {
        // First, create the category to get an ID
        const categoryId = await firestoreService.createCategory({
          ...data,
          order, // Use auto-calculated order
          mainImage: '', // Temporary, will update after image upload
        });

        // Upload the image
        const imagePath = storageService.getCategoryImagePath(categoryId, imageFile.name);
        imageUrl = await storageService.uploadImage(imageFile, imagePath);

        // Update category with the image URL
        await firestoreService.updateCategory(categoryId, {
          ...data,
          order, // Ensure order is preserved
          mainImage: imageUrl,
        });
      } else {
        // Create category without image
        await firestoreService.createCategory({
          ...data,
          order, // Use auto-calculated order
          mainImage: '', // Empty image URL
        });
      }

      // Navigate back to categories list
      navigate(`${adminBasePath}/categories`);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      console.error('Error creating category:', err);
      throw err; // Re-throw to let form handle it
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`${adminBasePath}/categories`);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black">
          {i18n.language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category'}
        </h2>
        <p className="mt-2 text-gray-700">
          {i18n.language === 'ar'
            ? 'قم بإنشاء فئة جديدة للقائمة'
            : 'Create a new menu category'}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border-2 border-gray-300 shadow p-6">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          nextOrder={nextOrder}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default CategoryNew;

