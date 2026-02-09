'use client';

interface SunyaColoredTextProps {
  className?: string;
  /**
   * Optional text to display instead of "SUNYA"
   * Will apply colors to matching letters (case-insensitive)
   */
  text?: string;
  /**
   * Size variant for the text
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  /**
   * Whether to use bold font weight
   */
  bold?: boolean;
}

/**
 * Color mapping for each letter in SUNYA:
 * S - Orange (#FF7A00)
 * U - Green (#00C853)
 * N - Purple (#8E24AA)
 * Y - Yellow (#FFD700)
 * A - Orange matching S (#FF7A00)
 */
const LETTER_COLORS: Record<string, string> = {
  S: '#FF7A00',
  U: '#00C853',
  N: '#8E24AA',
  Y: '#FFD700',
  A: '#FF7A00',
};

/**
 * A reusable component that renders "SUNYA" with each letter in its designated color.
 * Can also colorize custom text by applying the same color scheme to matching letters.
 */
export function SunyaColoredText({ className = '', text = 'SUNYA', size, bold = true }: SunyaColoredTextProps) {
  const sizeClass = size ? `text-${size}` : '';
  const fontWeight = bold ? 'font-bold' : '';

  const renderColoredText = (inputText: string) => {
    return inputText.split('').map((char, index) => {
      const upperChar = char.toUpperCase();
      const color = LETTER_COLORS[upperChar];

      if (color) {
        return (
          <span key={`${index}-${char}`} style={{ color }} className='inline'>
            {char}
          </span>
        );
      }

      // For non-SUNYA characters, render them normally
      return <span key={`${index}-${char}`}>{char}</span>;
    });
  };

  return (
    <span
      className={`${sizeClass} ${fontWeight} ${className}`}
      style={{
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)',
      }}
    >
      {renderColoredText(text)}
    </span>
  );
}

/**
 * A simpler inline version for use within text content
 * Renders "SUNYA" with color-coded letters
 */
export function InlineSunya({ className = '' }: { className?: string }) {
  return (
    <span className={`font-bold ${className}`}>
      <span style={{ color: '#FF7A00' }}>S</span>
      <span style={{ color: '#00C853' }}>U</span>
      <span style={{ color: '#8E24AA' }}>N</span>
      <span style={{ color: '#FFD700' }}>Y</span>
      <span style={{ color: '#FF7A00' }}>A</span>
    </span>
  );
}

export default SunyaColoredText;
