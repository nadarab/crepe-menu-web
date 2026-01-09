import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { submitRating } from '../services/firebase/ratings';

const Rate = () => {
  const { t, i18n } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

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

    if (feedback.trim() === '') {
      setError(t('errorNoFeedback', { ns: 'rate' }));
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
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
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
      <nav className="relative z-20 flex items-center justify-end px-6 md:px-12 pt-8 md:pt-10 pb-4 md:pb-6 bg-transparent backdrop-blur-0">
        {/* Navigation Links - Right side */}
        <div className="flex items-center gap-8 md:gap-10">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="text-white hover:text-yellow-400 transition-colors cursor-pointer"
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
              className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
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
            className={`text-white text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
            }`}
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
            className={`text-white text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
            }`}
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
            className={`text-white text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
            }`}
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
          <div className="flex items-center gap-2 ml-4 border-l border-white/30 pl-4">
            <button
              type="button"
              onClick={() => i18n.changeLanguage('en')}
              className={`font-bree text-base md:text-lg lg:text-xl tracking-wide transition-colors cursor-pointer ${
                i18n.language === 'en'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              }`}
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
            <span className="text-white/50 text-lg md:text-xl">|</span>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('ar')}
              className={`font-bree text-base md:text-lg lg:text-xl transition-colors cursor-pointer ${
                i18n.language === 'ar'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              }`}
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
      <div className="relative z-10 container mx-auto px-6 pt-0 md:pt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl text-white mb-4 ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
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
            className={`text-white/80 text-lg md:text-xl mb-8 ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
            }`}
          >
            {t('subtitle', { ns: 'rate' })}
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-3 md:gap-4 mb-10">
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
                  className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 transition-all duration-200"
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
            className={`w-full h-48 bg-[#2a2a2a] text-white rounded-2xl p-6 mb-6 
              placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 
              resize-none transition-opacity ${
                i18n.language === 'ar' ? 'font-tajawal text-right' : 'font-bree text-left'
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
              className="text-red-400 text-sm md:text-base mb-4"
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
            disabled={isSubmitting || isSubmitted}
            className={`px-8 py-3 md:px-10 md:py-4 rounded-xl text-lg md:text-xl font-semibold 
              transition-all duration-300 mb-6 ${
                i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
              } ${
                isSubmitted
                  ? 'bg-green-500 text-white cursor-default'
                  : isSubmitting
                  ? 'bg-yellow-400/50 text-gray-700 cursor-wait'
                  : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105 cursor-pointer'
              }`}
            style={{
              boxShadow: isSubmitted || isSubmitting ? 'none' : '0 4px 15px rgba(251, 191, 36, 0.3)'
            }}
          >
            {isSubmitted ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`text-white text-2xl md:text-3xl ${
                i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
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
