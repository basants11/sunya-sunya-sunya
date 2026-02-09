'use client';


export interface SafetyWarningData {
  title?: string;
  message: string;
  conditions?: string[];
  severity?: 'low' | 'moderate' | 'high';
  showConsultationNote?: boolean;
}

interface SafetyWarningBannerProps {
  data: SafetyWarningData;
  onDismiss?: () => void;
  className?: string;
}

export default function SafetyWarningBanner({
  data,
  onDismiss,
  className = '',
}: SafetyWarningBannerProps) {
  const {
    title = 'Dietary Consideration',
    message,
    conditions,
    severity = 'moderate',
    showConsultationNote = true,
  } = data;

  const getSeverityStyles = () => {
    switch (severity) {
      case 'low':
        return {
          bg: 'bg-luxury-gold/10',
          border: 'border-luxury-gold/20',
          icon: 'text-luxury-gold',
          text: 'text-luxury-dark-green/80',
        };
      case 'high':
        return {
          bg: 'bg-luxury-burnt-orange/10',
          border: 'border-luxury-burnt-orange/20',
          icon: 'text-luxury-burnt-orange/70',
          text: 'text-luxury-dark-green/80',
        };
      case 'moderate':
      default:
        return {
          bg: 'bg-luxury-gold/10',
          border: 'border-luxury-gold/20',
          icon: 'text-luxury-gold',
          text: 'text-luxury-dark-green/80',
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div
      className={`
        w-full
        ${styles.bg}
        ${styles.border}
        border
        rounded-xl
        p-5
        transition-all duration-300
        animate-fade-in-up
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0
            w-10 h-10
            rounded-full
            ${styles.bg}
            ${styles.icon}
            flex items-center justify-center
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4
            className={`
              text-base font-semibold
              ${styles.text}
              mb-2
            `}
          >
            {title}
          </h4>

          {/* Message */}
          <p
            className={`
              text-sm
              ${styles.text}
              leading-relaxed
              mb-3
            `}
          >
            {message}
          </p>

          {/* Conditions List */}
          {conditions && conditions.length > 0 && (
            <div className="mb-3">
              <p
                className={`
                  text-xs font-medium
                  ${styles.text}
                  mb-2
                `}
              >
                This may affect individuals with:
              </p>
              <ul className="space-y-1.5">
                {conditions.map((condition, index) => (
                  <li
                    key={index}
                    className={`
                      flex items-start gap-2
                      text-sm
                      ${styles.text}
                    `}
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Consultation Note */}
          {showConsultationNote && (
            <div
              className="
                mt-4
                px-4 py-3
                bg-luxury-beige/50
                rounded-lg
              "
            >
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-luxury-dark-green/60 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-xs text-luxury-dark-green/70 leading-relaxed">
                  Please consult your healthcare provider or a registered
                  dietitian for personalized advice regarding your dietary
                  needs and restrictions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="
              flex-shrink-0
              w-8 h-8
              rounded-full
              bg-luxury-beige/50
              text-luxury-dark-green/60
              hover:bg-luxury-beige
              hover:text-luxury-dark-green
              transition-all duration-300
              flex items-center justify-center
              focus:outline-none
              focus:ring-2
              focus:ring-luxury-gold/50
            "
            aria-label="Dismiss warning"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
