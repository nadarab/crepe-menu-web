import { useState, useRef, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (file: File | null, preview: string) => void;
  onError?: (error: string) => void;
  maxSizeMB?: number;
  required?: boolean;
  label?: string;
  className?: string;
}

const ImageUpload = ({
  value,
  onChange,
  onError,
  maxSizeMB = 10,
  required = false,
  label,
  className = '',
}: ImageUploadProps) => {
  const { i18n } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value || '');

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return i18n.language === 'ar'
        ? 'الملف يجب أن يكون صورة'
        : 'File must be an image';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return i18n.language === 'ar'
        ? `حجم الصورة يجب أن يكون أقل من ${maxSizeMB} ميجابايت`
        : `Image size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  // Compress image (optional, client-side compression)
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large (max 1920px on longest side)
          const MAX_DIMENSION = 1920;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = (height * MAX_DIMENSION) / width;
              width = MAX_DIMENSION;
            } else {
              width = (width * MAX_DIMENSION) / height;
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to blob with quality compression (0.8 = 80% quality)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file); // Fallback to original if compression fails
              }
            },
            file.type,
            0.8
          );
        };
      };
    });
  };

  // Handle file selection
  const handleFile = async (file: File) => {
    // Validate
    const error = validateFile(file);
    if (error) {
      onError?.(error);
      return;
    }

    try {
      setUploadProgress(25);

      // Compress image
      const compressedFile = await compressImage(file);
      setUploadProgress(50);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        setUploadProgress(100);
        onChange(compressedFile, previewUrl);

        // Reset progress after a moment
        setTimeout(() => setUploadProgress(0), 500);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      onError?.(
        i18n.language === 'ar'
          ? 'حدث خطأ أثناء معالجة الصورة'
          : 'An error occurred while processing the image'
      );
      console.error('Error processing image:', err);
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Remove image
  const handleRemove = () => {
    setPreview('');
    onChange(null, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentPreview = preview || value;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-black mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-4">
        {/* Preview */}
        {currentPreview && (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={currentPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label={i18n.language === 'ar' ? 'إزالة الصورة' : 'Remove image'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-center">
                  {uploadProgress}% {i18n.language === 'ar' ? 'مكتمل' : 'complete'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${
              isDragging
                ? 'border-black bg-gray-50'
                : currentPreview
                ? 'border-gray-300 hover:border-gray-400'
                : 'border-gray-300 hover:border-black hover:bg-gray-50'
            }
            ${required && !currentPreview ? 'border-red-300' : ''}
          `}
        >
          {!currentPreview && (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-black hover:text-gray-700 cursor-pointer">
                  {i18n.language === 'ar' ? 'انقر للرفع' : 'Click to upload'}
                </span>{' '}
                {i18n.language === 'ar' ? 'أو اسحب وأفلت' : 'or drag and drop'}
              </div>
              <p className="text-xs text-gray-600">
                {i18n.language === 'ar'
                  ? `PNG, JPG, GIF حتى ${maxSizeMB}MB`
                  : `PNG, JPG, GIF up to ${maxSizeMB}MB`}
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            required={required && !currentPreview}
          />

          {currentPreview && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
            >
              {i18n.language === 'ar' ? 'تغيير الصورة' : 'Change Image'}
            </button>
          )}
        </div>

        {!currentPreview && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            {i18n.language === 'ar' ? 'اختر صورة' : 'Select Image'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

