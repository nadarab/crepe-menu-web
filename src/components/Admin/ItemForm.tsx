import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../../services/firebase/storageService';
import type { Category } from '../../types/category';
import type { MenuItem, MenuItemData } from '../../types/menuItem';

interface ItemFormProps {
  categories: Category[];
  initialData?: MenuItem & { categoryId: string };
  onSubmit: (categoryId: string, data: MenuItemData, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ItemForm = ({ categories, initialData, onSubmit, onCancel, loading = false }: ItemFormProps) => {
  const { i18n } = useTranslation();
  const isEditMode = !!initialData;

  // Character limits
  const LIMITS = {
    NAME: 17,
  };

  const [formData, setFormData] = useState<MenuItemData>({
    order: initialData?.order || 1,
    image: initialData?.image || '',
    name: {
      en: initialData?.name.en || '',
      ar: initialData?.name.ar || '',
    },
    price: initialData?.price,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialData?.categoryId || categories[0]?.id || ''
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        order: initialData.order,
        image: initialData.image,
        name: initialData.name,
        price: initialData.price,
      });
      setSelectedCategoryId(initialData.categoryId);
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'File must be an image' });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 10MB' });
        return;
      }

      setImageFile(file);
      setErrors({ ...errors, image: '' });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCategoryId) {
      newErrors.category = 'Category is required';
    }
    if (!formData.name.en.trim()) {
      newErrors.nameEn = 'English name is required';
    } else if (formData.name.en.length > LIMITS.NAME) {
      newErrors.nameEn = `Name must be ${LIMITS.NAME} characters or less`;
    }
    if (!formData.name.ar.trim()) {
      newErrors.nameAr = 'Arabic name is required';
    } else if (formData.name.ar.length > LIMITS.NAME) {
      newErrors.nameAr = `Name must be ${LIMITS.NAME} characters or less`;
    }
    if (formData.order < 1) {
      newErrors.order = 'Order must be at least 1';
    }
    if (!imagePreview && !imageFile) {
      newErrors.image = 'Image is required';
    }
    if (formData.price !== undefined && formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to get character counter color
  const getCounterColor = (current: number, limit: number) => {
    const remaining = limit - current;
    if (remaining < 0) return 'text-red-600 font-bold';
    if (remaining <= limit * 0.1) return 'text-orange-500 font-semibold'; // 10% left
    if (remaining <= limit * 0.2) return 'text-yellow-600'; // 20% left
    return 'text-gray-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!selectedCategoryId) {
      return;
    }

    try {
      await onSubmit(selectedCategoryId, formData, imageFile || undefined);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الفئة' : 'Category'}
        </label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          disabled={isEditMode}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        >
          <option value="">
            {i18n.language === 'ar' ? 'اختر الفئة' : 'Select Category'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title[i18n.language as 'en' | 'ar']}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الترتيب' : 'Order'}
        </label>
        <input
          type="number"
          min="1"
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {errors.order && (
          <p className="mt-1 text-sm text-red-600">{errors.order}</p>
        )}
      </div>

      {/* Name - English */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}
          <span className={`text-xs ml-2 ${getCounterColor(formData.name.en.length, LIMITS.NAME)}`}>
            {formData.name.en.length}/{LIMITS.NAME}
          </span>
        </label>
        <input
          type="text"
          value={formData.name.en}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, en: e.target.value },
            })
          }
          maxLength={LIMITS.NAME}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {errors.nameEn && (
          <p className="mt-1 text-sm text-red-600">{errors.nameEn}</p>
        )}
      </div>

      {/* Name - Arabic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
          <span className={`text-xs ml-2 ${getCounterColor(formData.name.ar.length, LIMITS.NAME)}`}>
            {formData.name.ar.length}/{LIMITS.NAME}
          </span>
        </label>
        <input
          type="text"
          value={formData.name.ar}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: { ...formData.name, ar: e.target.value },
            })
          }
          maxLength={LIMITS.NAME}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          dir="rtl"
          required
        />
        {errors.nameAr && (
          <p className="mt-1 text-sm text-red-600">{errors.nameAr}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'السعر (اختياري)' : 'Price (Optional)'}
        </label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={formData.price !== undefined ? formData.price : ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0.00"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الصورة' : 'Image'}
        </label>
        <div className="space-y-4">
          {imagePreview && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
          <p className="text-sm text-gray-500">
            {i18n.language === 'ar'
              ? 'الحد الأقصى لحجم الملف: 10 ميجابايت'
              : 'Maximum file size: 10MB'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? i18n.language === 'ar'
              ? 'جاري الحفظ...'
              : 'Saving...'
            : isEditMode
            ? i18n.language === 'ar'
              ? 'تحديث'
              : 'Update'
            : i18n.language === 'ar'
            ? 'إنشاء'
            : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
        >
          {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;

