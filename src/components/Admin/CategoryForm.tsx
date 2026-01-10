import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../../services/firebase/storageService';
import type { Category, CategoryData } from '../../types/category';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryData, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm = ({ initialData, onSubmit, onCancel, loading = false }: CategoryFormProps) => {
  const { i18n } = useTranslation();
  const isEditMode = !!initialData;

  // Character limits
  const LIMITS = {
    TITLE: 20,
    DESCRIPTION: 180,
    TAGLINE: 25,
  };

  const [formData, setFormData] = useState<CategoryData>({
    order: initialData?.order || 1,
    mainImage: initialData?.mainImage || '',
    title: {
      en: initialData?.title.en || '',
      ar: initialData?.title.ar || '',
    },
    description: {
      en: initialData?.description.en || '',
      ar: initialData?.description.ar || '',
    },
    tagline: {
      en: initialData?.tagline?.en || '',
      ar: initialData?.tagline?.ar || '',
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.mainImage || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        order: initialData.order,
        mainImage: initialData.mainImage,
        title: initialData.title,
        description: initialData.description,
        tagline: initialData.tagline || { en: '', ar: '' },
      });
      setImagePreview(initialData.mainImage);
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

    if (!formData.title.en.trim()) {
      newErrors.titleEn = 'English title is required';
    } else if (formData.title.en.length > LIMITS.TITLE) {
      newErrors.titleEn = `Title must be ${LIMITS.TITLE} characters or less`;
    }
    if (!formData.title.ar.trim()) {
      newErrors.titleAr = 'Arabic title is required';
    } else if (formData.title.ar.length > LIMITS.TITLE) {
      newErrors.titleAr = `Title must be ${LIMITS.TITLE} characters or less`;
    }
    if (!formData.description.en.trim()) {
      newErrors.descriptionEn = 'English description is required';
    } else if (formData.description.en.length > LIMITS.DESCRIPTION) {
      newErrors.descriptionEn = `Description must be ${LIMITS.DESCRIPTION} characters or less`;
    }
    if (!formData.description.ar.trim()) {
      newErrors.descriptionAr = 'Arabic description is required';
    } else if (formData.description.ar.length > LIMITS.DESCRIPTION) {
      newErrors.descriptionAr = `Description must be ${LIMITS.DESCRIPTION} characters or less`;
    }
    if (formData.tagline?.en && formData.tagline.en.length > LIMITS.TAGLINE) {
      newErrors.taglineEn = `Tagline must be ${LIMITS.TAGLINE} characters or less`;
    }
    if (formData.tagline?.ar && formData.tagline.ar.length > LIMITS.TAGLINE) {
      newErrors.taglineAr = `Tagline must be ${LIMITS.TAGLINE} characters or less`;
    }
    if (formData.order < 1) {
      newErrors.order = 'Order must be at least 1';
    }
    if (!imagePreview && !imageFile) {
      newErrors.image = 'Image is required';
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

    try {
      await onSubmit(formData, imageFile || undefined);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Title - English */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
          <span className={`text-xs ml-2 ${getCounterColor(formData.title.en.length, LIMITS.TITLE)}`}>
            {formData.title.en.length}/{LIMITS.TITLE}
          </span>
        </label>
        <input
          type="text"
          value={formData.title.en}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: { ...formData.title, en: e.target.value },
            })
          }
          maxLength={LIMITS.TITLE}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {errors.titleEn && (
          <p className="mt-1 text-sm text-red-600">{errors.titleEn}</p>
        )}
      </div>

      {/* Title - Arabic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
          <span className={`text-xs ml-2 ${getCounterColor(formData.title.ar.length, LIMITS.TITLE)}`}>
            {formData.title.ar.length}/{LIMITS.TITLE}
          </span>
        </label>
        <input
          type="text"
          value={formData.title.ar}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: { ...formData.title, ar: e.target.value },
            })
          }
          maxLength={LIMITS.TITLE}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          dir="rtl"
          required
        />
        {errors.titleAr && (
          <p className="mt-1 text-sm text-red-600">{errors.titleAr}</p>
        )}
      </div>

      {/* Description - English */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
          <span className={`text-xs ml-2 ${getCounterColor(formData.description.en.length, LIMITS.DESCRIPTION)}`}>
            {formData.description.en.length}/{LIMITS.DESCRIPTION}
          </span>
        </label>
        <textarea
          value={formData.description.en}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: { ...formData.description, en: e.target.value },
            })
          }
          rows={4}
          maxLength={LIMITS.DESCRIPTION}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {errors.descriptionEn && (
          <p className="mt-1 text-sm text-red-600">{errors.descriptionEn}</p>
        )}
      </div>

      {/* Description - Arabic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
          <span className={`text-xs ml-2 ${getCounterColor(formData.description.ar.length, LIMITS.DESCRIPTION)}`}>
            {formData.description.ar.length}/{LIMITS.DESCRIPTION}
          </span>
        </label>
        <textarea
          value={formData.description.ar}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: { ...formData.description, ar: e.target.value },
            })
          }
          rows={4}
          maxLength={LIMITS.DESCRIPTION}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          dir="rtl"
          required
        />
        {errors.descriptionAr && (
          <p className="mt-1 text-sm text-red-600">{errors.descriptionAr}</p>
        )}
      </div>

      {/* Tagline - English */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الشعار (إنجليزي)' : 'Tagline (English)'}
          <span className="text-gray-500 text-xs ml-2">
            {i18n.language === 'ar' ? '(اختياري)' : '(Optional)'}
          </span>
          <span className={`text-xs ml-2 ${getCounterColor(formData.tagline?.en?.length || 0, LIMITS.TAGLINE)}`}>
            {formData.tagline?.en?.length || 0}/{LIMITS.TAGLINE}
          </span>
        </label>
        <input
          type="text"
          value={formData.tagline?.en || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              tagline: { ...formData.tagline!, en: e.target.value },
            })
          }
          maxLength={LIMITS.TAGLINE}
          placeholder={i18n.language === 'ar' ? 'مثل: LOVE AT FIRST BITE' : 'e.g., LOVE AT FIRST BITE'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.taglineEn && (
          <p className="mt-1 text-sm text-red-600">{errors.taglineEn}</p>
        )}
      </div>

      {/* Tagline - Arabic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الشعار (عربي)' : 'Tagline (Arabic)'}
          <span className="text-gray-500 text-xs ml-2">
            {i18n.language === 'ar' ? '(اختياري)' : '(Optional)'}
          </span>
          <span className={`text-xs ml-2 ${getCounterColor(formData.tagline?.ar?.length || 0, LIMITS.TAGLINE)}`}>
            {formData.tagline?.ar?.length || 0}/{LIMITS.TAGLINE}
          </span>
        </label>
        <input
          type="text"
          value={formData.tagline?.ar || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              tagline: { ...formData.tagline!, ar: e.target.value },
            })
          }
          maxLength={LIMITS.TAGLINE}
          placeholder={i18n.language === 'ar' ? 'مثل: حب من أول قضمة' : 'e.g., حب من أول قضمة'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          dir="rtl"
        />
        {errors.taglineAr && (
          <p className="mt-1 text-sm text-red-600">{errors.taglineAr}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {i18n.language === 'ar' ? 'الصورة الرئيسية' : 'Main Image'}
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

export { CategoryForm };
export default CategoryForm;