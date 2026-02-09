"use client";

interface SocialIconProps {
  className?: string;
  size?: number;
}

// Facebook Icon - Official blue color
export function FacebookIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="24" cy="24" r="24" fill="#1877F2" />
      <path
        d="M31.5 24.5H26V36H21V24.5H17V20H21V17C21 13.5 23 11 27 11H32V15.5H28.5C27.5 15.5 26 15.8 26 17.5V20H31.5L31.5 24.5Z"
        fill="white"
      />
    </svg>
  );
}

// Instagram Icon - Gradient colors
export function InstagramIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="instagramGradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#FFD600" />
          <stop offset="50%" stopColor="#FF0100" />
          <stop offset="100%" stopColor="#D800B9" />
        </linearGradient>
        <linearGradient
          id="instagramGradient2"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#FF6400" />
          <stop offset="100%" stopColor="#FF0100" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#instagramGradient)" />
      <rect
        x="12"
        y="12"
        width="24"
        height="24"
        rx="6"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx="24"
        cy="24"
        r="6"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="33" cy="15" r="2" fill="white" />
    </svg>
  );
}

// TikTok Icon - Black with cyan/magenta accent
export function TikTokIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill="#000000" />
      <path
        d="M34 22.5C32.5 22.5 31.2 22 30.2 21.2V30C30.2 33.5 27.3 36.3 23.8 36.3C20.3 36.3 17.5 33.5 17.5 30C17.5 26.5 20.3 23.7 23.8 23.7C24.2 23.7 24.6 23.8 25 23.8V27.5C24.6 27.4 24.2 27.3 23.8 27.3C22.3 27.3 21 28.5 21 30C21 31.5 22.3 32.8 23.8 32.8C25.3 32.8 26.5 31.6 26.5 30.1V15H30.2C30.2 15 30.3 15.5 30.5 16.2C31 18 32.5 19.5 34.5 20V22.5H34Z"
        fill="white"
      />
      <path
        d="M34.3 22.3C34.2 22.3 34.1 22.3 34 22.3V20C32.5 19.5 31.3 18.5 30.5 17.2L30.2 16.5V21.5C31.3 22.2 32.6 22.6 34 22.6V22.3H34.3Z"
        fill="#00F2EA"
      />
      <path
        d="M30.2 21.5V16.5L30.5 17.2C31.3 18.5 32.5 19.5 34 20V22.3C32.6 22.3 31.3 22 30.2 21.3V21.5Z"
        fill="#FF0050"
      />
    </svg>
  );
}

// X (Twitter) Icon - Black
export function XIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill="#000000" />
      <path
        d="M13 13H20.5L24.5 19.5L29 13H33L26.5 22L34 35H26.5L22 27.5L17 35H13L20 25L13 13ZM21.5 15.5H19L25.5 32.5H28L21.5 15.5Z"
        fill="white"
      />
    </svg>
  );
}

// Threads Icon - Black
export function ThreadsIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill="#000000" />
      <path
        d="M24 13C17.5 13 13 17.5 13 24C13 30.5 17.5 35 24 35C30.5 35 35 30.5 35 24C35 17.5 30.5 13 24 13ZM24 32C19.5 32 16 28.5 16 24C16 19.5 19.5 16 24 16C28.5 16 32 19.5 32 24C32 28.5 28.5 32 24 32Z"
        fill="white"
      />
      <path
        d="M28 20.5C27.5 20.5 27 20.7 26.6 21C26 21.5 25.5 22.3 25.5 23.5V26.5C25.5 27.5 25 28.2 24.3 28.5C23.6 28.8 22.8 28.6 22.3 28C21.8 27.5 21.7 26.7 22 26C22.3 25.3 23 24.8 24 24.8C24.3 24.8 24.5 24.6 24.5 24.3V22.8C24.5 22.5 24.3 22.3 24 22.3C22 22.3 20.3 23.5 19.6 25.2C18.9 26.9 19.3 28.9 20.6 30.2C21.9 31.5 23.9 31.9 25.6 31.2C27.3 30.5 28.5 28.8 28.5 26.8V23.5C28.5 23.2 28.7 23 29 23C29.5 23 29.8 22.7 29.8 22.2C29.8 21.7 29.5 21.4 29 21.4H28V20.5Z"
        fill="white"
      />
    </svg>
  );
}

// Website/Globe Icon - Blue gradient
export function WebsiteIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="websiteGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#websiteGradient)" />
      <circle
        cx="24"
        cy="24"
        r="10"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="4"
        ry="10"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
      />
      <line x1="14" y1="24" x2="34" y2="24" stroke="white" strokeWidth="2.5" />
    </svg>
  );
}

// Map/Location Icon - Green gradient
export function MapIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#mapGradient)" />
      <path
        d="M24 12C19 12 15 16 15 21C15 28 24 36 24 36C24 36 33 28 33 21C33 16 29 12 24 12ZM24 25C21.8 25 20 23.2 20 21C20 18.8 21.8 17 24 17C26.2 17 28 18.8 28 21C28 23.2 26.2 25 24 25Z"
        fill="white"
      />
    </svg>
  );
}

// YouTube Icon - Red
export function YouTubeIcon({ className = "", size = 28 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill="#FF0000" />
      <path
        d="M36.5 19.5C36.3 18.7 35.7 18.1 34.9 17.9C33.3 17.5 24 17.5 24 17.5C24 17.5 14.7 17.5 13.1 17.9C12.3 18.1 11.7 18.7 11.5 19.5C11.1 21.1 11.1 24 11.1 24C11.1 24 11.1 26.9 11.5 28.5C11.7 29.3 12.3 29.9 13.1 30.1C14.7 30.5 24 30.5 24 30.5C24 30.5 33.3 30.5 34.9 30.1C35.7 29.9 36.3 29.3 36.5 28.5C36.9 26.9 36.9 24 36.9 24C36.9 24 36.9 21.1 36.5 19.5ZM21.8 26.8V21.2L27.2 24L21.8 26.8Z"
        fill="white"
      />
    </svg>
  );
}
