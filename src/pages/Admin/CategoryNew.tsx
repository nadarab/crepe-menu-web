import { useState } from 'react';
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

  const handleSubmit = async (data: CategoryData, imageFile?: File) => {
    if (!imageFile) {
      setError('Image is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // First, create the category to get an ID
      const categoryId = await firestoreService.createCategory({
        ...data,
        mainImage: '', // Temporary, will update after image upload
      });

      // Upload the image
      const imagePath = storageService.getCategoryImagePath(categoryId, imageFile.name);
      const imageUrl = await storageService.uploadImage(imageFile, imagePath);

      // Update category with the image URL
      await firestoreService.updateCategory(categoryId, {
        ...data,
        mainImage: imageUrl,
      });

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
        <h2 className="text-3xl font-bold text-gray-900">
          {i18n.language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category'}
        </h2>
        <p className="mt-2 text-gray-600">
          {i18n.language === 'ar'
            ? 'قم بإنشاء فئة جديدة للقائمة'
            : 'Create a new menu category'}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default CategoryNew;

