import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { submitRating } from '../services/firebase/ratings';

const Rate = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Helper function to determine if a navigation item is active
  const isActivePage = (path: string) => {
    if (path === '/' || path === 'hero') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const handleStarClick = (value: number) => {
    setRating(value);
    setError('');
  };

  const handleStarHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      setError(t('errorNoRating', { ns: 'rate' }));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting rating...', { rating, feedback: feedback.trim() });
      
      await submitRating({
        rating,
        feedback: feedback.trim(),
      });

      console.log('Rating submitted successfully!');

      // Success
      setIsSubmitted(true);
      setRating(0);
      setFeedback('');

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to submit rating:', err);
      console.error('Error details:', err.message, err.code);
      
      // Show more specific error message
      const errorMessage = err.message || t('errorSubmit', { ns: 'rate' });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#1a1a1a] relative"
      style={{
        overflow: 'hidden',
        touchAction: 'pan-y pinch-zoom'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Backgrounds/BackgroundLap.png"
          alt="Background"
          className="hidden md:block w-full h-full object-cover"
          onError={(e) => {
            // Hide image if it doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
        <img
          src="/images/Backgrounds/Backgroundphone.png"
          alt="Background"
          className="block md:hidden w-full h-full object-cover"
          onError={(e) => {
            // Hide image if it doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Decorative shapes (fallback when no background image) */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 z-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gray-700 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-gray-800 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Bar - Matching Home Page */}
      <nav className="relative z-20 flex items-center justify-end px-3 xs:px-4 sm:px-6 md:px-12 pt-6 xs:pt-7 sm:pt-8 md:pt-10 pb-3 xs:pb-3.5 sm:pb-4 md:pb-6 bg-transparent backdrop-blur-0">
        {/* Navigation Links - Right side */}
        <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 text-sm xs:text-base">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className={`hover:text-yellow-400 transition-colors cursor-pointer ${
              isActivePage('/') ? 'text-yellow-400' : 'text-white'
            }`}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
            aria-label="Home"
          >
            <svg
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/#menu'}
            className={`tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl' : 'font-bree text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl'
            } ${isActivePage('/') ? 'text-yellow-400 font-semibold' : 'text-white'}`}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            {t('menu', { ns: 'navigation' })}
          </button>
          <button
            type="button"
            className={`tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl' : 'font-bree text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl'
            } ${isActivePage('/rate') ? 'text-yellow-400 font-semibold' : 'text-white'}`}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            {t('rate', { ns: 'navigation' })}
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/contact'}
            className={`tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl' : 'font-bree text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl'
            } ${isActivePage('/contact') ? 'text-yellow-400 font-semibold' : 'text-white'}`}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            {t('contact', { ns: 'navigation' })}
          </button>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 ml-2 xs:ml-3 sm:ml-4 border-l border-white/30 pl-2 xs:pl-3 sm:pl-4">
            <button
              type="button"
              onClick={() => i18n.changeLanguage('en')}
              className={`font-bree tracking-wide transition-colors cursor-pointer ${
                i18n.language === 'en'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              } text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl`}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer',
                borderRadius: 0,
                boxShadow: 'none'
              }}
            >
              EN
            </button>
            <span className="text-white/50 text-sm xs:text-base sm:text-lg md:text-xl">|</span>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('ar')}
              className={`font-bree transition-colors cursor-pointer ${
                i18n.language === 'ar'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              } text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl`}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer',
                borderRadius: 0,
                boxShadow: 'none'
              }}
            >
              AR
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-3 xs:px-4 sm:px-6 pt-16 sm:pt-20 md:pt-2 flex items-center justify-center min-h-[calc(100vh-120px)] md:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title */}
          <h1
            className={`text-white mb-3 xs:mb-3.5 sm:mb-4 ${
              i18n.language === 'ar' ? 'font-tajawal text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl' : 'font-bree text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
            }`}
            style={{ 
              letterSpacing: '0.05em',
              fontWeight: 400 
            }}
          >
            {t('title', { ns: 'rate' })}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-white/80 mb-6 xs:mb-7 sm:mb-8 ${
              i18n.language === 'ar' ? 'font-tajawal text-base xs:text-lg sm:text-lg md:text-xl' : 'font-bree text-base xs:text-lg sm:text-lg md:text-xl'
            }`}
          >
            {t('subtitle', { ns: 'rate' })}
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 mb-8 xs:mb-9 sm:mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="focus:outline-none cursor-pointer bg-transparent border-0 p-0"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: 0
                }}
              >
                <svg
                  className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-all duration-200"
                  fill={
                    star <= (hoveredRating || rating)
                      ? '#FBBF24'
                      : 'none'
                  }
                  stroke={
                    star <= (hoveredRating || rating)
                      ? '#FBBF24'
                      : '#9CA3AF'
                  }
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </motion.button>
            ))}
          </div>

          {/* Feedback Textarea */}
          <motion.textarea
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t('feedbackPlaceholder', { ns: 'rate' })}
            disabled={isSubmitting || isSubmitted}
            className={`w-full h-40 xs:h-44 sm:h-48 bg-[#2a2a2a] text-white rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 mb-5 xs:mb-5.5 sm:mb-6 
              placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 
              resize-none transition-opacity ${
                i18n.language === 'ar' ? 'font-tajawal text-right text-sm xs:text-base' : 'font-bree text-left text-sm xs:text-base'
              } ${isSubmitting || isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'
            }}
          />

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs xs:text-sm sm:text-sm md:text-base mb-3 xs:mb-3.5 sm:mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={handleSubmit}
            disabled={isSubmitting || isSubmitted || rating === 0}
            className={`rounded-xl font-semibold 
              transition-all duration-300 mb-5 xs:mb-5.5 sm:mb-6 ${
                i18n.language === 'ar' ? 'font-tajawal text-base xs:text-lg sm:text-lg md:text-xl px-6 xs:px-7 sm:px-8 md:px-10 py-2.5 xs:py-3 sm:py-3 md:py-4' : 'font-bree text-base xs:text-lg sm:text-lg md:text-xl px-6 xs:px-7 sm:px-8 md:px-10 py-2.5 xs:py-3 sm:py-3 md:py-4'
              } ${
                i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
              } ${
                isSubmitted
                  ? 'text-white cursor-default'
                  : isSubmitting
                  ? 'text-gray-900 cursor-wait'
                  : rating === 0
                  ? 'text-gray-500 cursor-not-allowed opacity-50'
                  : 'text-gray-900 hover:scale-105 cursor-pointer font-bold'
              }`}
            style={{
              backgroundColor: isSubmitted 
                ? '#10b981' 
                : isSubmitting 
                ? '#fde047' 
                : rating === 0 
                ? 'rgba(156, 163, 175, 0.3)' 
                : '#fbbf24',
              boxShadow: (isSubmitted || isSubmitting || rating === 0) ? 'none' : '0 4px 15px rgba(251, 191, 36, 0.5)',
              border: 'none'
            }}
          >
            {isSubmitted ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('submitted', { ns: 'rate' })}
              </span>
            ) : isSubmitting ? (
              t('submitting', { ns: 'rate' })
            ) : (
              t('submit', { ns: 'rate' })
            )}
          </motion.button>

          {/* Thanks Message */}
          {isSubmitted && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`text-white ${
                i18n.language === 'ar' ? 'font-tajawal text-xl xs:text-2xl sm:text-2xl md:text-3xl' : 'font-bree text-xl xs:text-2xl sm:text-2xl md:text-3xl'
              }`}
              style={{ 
                letterSpacing: '0.05em' 
              }}
            >
              {t('thanks', { ns: 'rate' })}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Rate;
