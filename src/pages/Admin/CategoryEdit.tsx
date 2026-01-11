import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { firestoreService } from '../../services/firebase/firestoreService';
import { storageService } from '../../services/firebase/storageService';
import CategoryForm from '../../components/Admin/CategoryForm';
import type { Category, CategoryData } from '../../types/category';

const CategoryEdit = () => {
  const { t, i18n } = useTranslation();
  const { secret, id } = useParams<{ secret: string; id: string }>();
  const navigate = useNavigate();
  const adminBasePath = `/admin/${secret}`;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getCategory(id!);
      if (!data) {
        setError('Category not found');
        return;
      }
      setCategory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load category');
      console.error('Error loading category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CategoryData, imageFile?: File) => {
    if (!id || !category) return;

    try {
      setSaving(true);
      setError(null);

      let imageUrl = data.mainImage;

      // If a new image file is provided, upload it
      if (imageFile) {
        // Delete old image if it exists
        if (category.mainImage) {
          try {
            await storageService.deleteImage(category.mainImage);
          } catch (imgErr) {
            console.warn('Error deleting old image:', imgErr);
            // Continue even if deletion fails
          }
        }

        // Upload new image
        const imagePath = storageService.getCategoryImagePath(id, imageFile.name);
        imageUrl = await storageService.uploadImage(imageFile, imagePath);
      }

      // Update category in Firestore
      await firestoreService.updateCategory(id, {
        ...data,
        mainImage: imageUrl,
      });

      // Navigate back to categories list
      navigate(`${adminBasePath}/categories`);
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
      console.error('Error updating category:', err);
      throw err; // Re-throw to let form handle it
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`${adminBasePath}/categories`);
  };

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

  if (error && !category) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
        <p className="text-red-800 font-semibold">{error}</p>
        <button
          onClick={handleCancel}
          className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
        >
          {i18n.language === 'ar' ? 'العودة' : 'Go Back'}
        </button>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black">
          {i18n.language === 'ar' ? 'تعديل الفئة' : 'Edit Category'}
        </h2>
        <p className="mt-2 text-gray-700">
          {i18n.language === 'ar'
            ? 'قم بتحديث معلومات الفئة'
            : 'Update category information'}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border-2 border-gray-300 shadow p-6">
        <CategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default CategoryEdit;

