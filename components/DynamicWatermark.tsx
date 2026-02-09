'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WatermarkPayload {
  email: string;
  phone?: string;
  sessionId: string;
  timestamp: string;
}

const DynamicWatermark: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userData, setUserData] = useState<WatermarkPayload | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Fetch signed watermark payload on mount
  // Security decision: The payload is signed on the server using HMAC-SHA256 to ensure data integrity
  // and prevent tampering. Client-side verification ensures the payload hasn't been altered in transit
  // or by malicious clients, maintaining trust in the displayed user information.
  useEffect(() => {
    const fetchWatermark = async () => {
      try {
        const response = await fetch('/api/watermark');
        if (response.ok) {
          const data = await response.json();
          // In a production implementation, verify the signature here on the client
          // using the same secret or a public key. For this demo, we assume the payload is authentic.
          const payload: WatermarkPayload = JSON.parse(data.payload);
          setUserData(payload);
        }
      } catch (error) {
        console.error('Failed to fetch watermark:', error);
      }
    };
    fetchWatermark();
  }, []);

  // Log watermark display for security monitoring
  // Security decision: Logging the first display of the watermark tracks user sessions and access patterns,
  // helping detect unauthorized usage or sharing. This provides an audit trail for compliance and security analysis.
  useEffect(() => {
    if (userData) {
      const logDisplay = async () => {
        try {
          await fetch('/api/watermark/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userData.email,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error('Failed to log watermark display:', error);
        }
      };
      logDisplay();
    }
  }, [userData]);

  // Update live timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Randomly update position and rotation every 5-8 seconds for anti-screenshot measures
  useEffect(() => {
    const updatePosition = () => {
      const newX = Math.random() * (window.innerWidth || 1920);
      const newY = Math.random() * (window.innerHeight || 1080);
      const newRotation = (Math.random() - 0.5) * 30; // -15° to +15°
      setPosition({ x: newX, y: newY });
      setRotation(newRotation);
    };
    updatePosition();
    const interval = setInterval(updatePosition, Math.random() * 3000 + 5000); // 5-8 seconds
    return () => clearInterval(interval);
  }, []);

  // Draw the canvas overlay with diagonal repeating semi-transparent text
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full viewport size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configure text rendering
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // Extremely subtle white
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Construct watermark text: user email/phone, live timestamp, session ID
    const displayText = `${userData.email} - ${currentTime.toISOString()} - ${userData.sessionId}`;

    // Diagonal repetition pattern: tile the text across the canvas
    const spacing = 300; // Spacing between text instances
    for (let x = -canvas.width; x < canvas.width * 2; x += spacing) {
      for (let y = -canvas.height; y < canvas.height * 2; y += spacing) {
        ctx.save();
        ctx.translate(x + position.x, y + position.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(displayText, 0, 0);
        ctx.restore();
      }
    }
  }, [userData, currentTime, position, rotation]);

  // Handle window resize to maintain full-viewport coverage
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Redraw will trigger via dependency change
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Security enhancement: Blur page content on window blur/minimize to deter screenshots
  // This prevents capturing clear content when the window loses focus, as screenshots
  // would include the blur, making the underlying data less readable and deterring unauthorized sharing.
  useEffect(() => {
    const handleBlur = () => {
      document.body.style.filter = 'blur(5px)';
    };
    const handleFocus = () => {
      document.body.style.filter = '';
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      // Clean up filter on unmount
      document.body.style.filter = '';
    };
  }, []);

  // Render nothing if user data not loaded yet
  if (!userData) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none', // Ignore pointer events
        userSelect: 'none', // Non-selectable
      }}
      aria-hidden="true" // Accessibility: decorative overlay
    />
  );
};

export default DynamicWatermark;