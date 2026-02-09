'use client';

import React from 'react';

interface SunyaBoldTextProps {
  children: string;
  className?: string;
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
 * Renders "SUNYA" with each letter in its designated color
 */
function renderColoredSunya(className?: string): React.ReactNode {
  return (
    <>
      <span style={{ color: LETTER_COLORS.S }} className={className}>
        S
      </span>
      <span style={{ color: LETTER_COLORS.U }} className={className}>
        U
      </span>
      <span style={{ color: LETTER_COLORS.N }} className={className}>
        N
      </span>
      <span style={{ color: LETTER_COLORS.Y }} className={className}>
        Y
      </span>
      <span style={{ color: LETTER_COLORS.A }} className={className}>
        A
      </span>
    </>
  );
}

/**
 * A utility component that renders text with "sunya" (case-insensitive)
 * converted to colored uppercase letters (**S**U**N**Y**A** with respective colors).
 *
 * Usage:
 * <SunyaBoldText>Welcome to sunya's world</SunyaBoldText>
 * // Renders: Welcome to **S**U**N**Y**A** (with colors) 's world
 */
export function SunyaBoldText({ children, className = '' }: SunyaBoldTextProps) {
  // Split the text by "sunya" (case-insensitive) and render matches in colored uppercase
  const parts = children.split(/(sunya)/gi);

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === 'sunya') {
          return (
            <strong key={index} className={`font-bold ${className}`}>
              {renderColoredSunya()}
            </strong>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

/**
 * A hook that processes text content and returns React elements with
 * "sunya" rendered in colored uppercase letters (**S**U**N**Y**A** with respective colors).
 *
 * Usage:
 * const formattedText = useSunyaBold("Welcome to sunya's world");
 * // Returns React elements with SUNYA in colors
 */
export function useSunyaBold(text: string, className?: string): React.ReactNode {
  const parts = text.split(/(sunya)/gi);

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === 'sunya') {
          return (
            <strong key={index} className={`font-bold ${className}`}>
              {renderColoredSunya()}
            </strong>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

/**
 * A utility function to process any string and replace "sunya"
 * with colored **S**U**N**Y**A** letters.
 *
 * Returns a ReactNode that can be rendered directly.
 */
export function formatSunyaBold(text: string, className?: string): React.ReactNode {
  const parts = text.split(/(sunya)/gi);

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === 'sunya') {
          return (
            <strong key={index} className={`font-bold ${className}`}>
              {renderColoredSunya()}
            </strong>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

export default SunyaBoldText;
