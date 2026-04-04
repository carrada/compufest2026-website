'use client';

import { useState, CSSProperties } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  cardColor?: string;
  textColor?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export function FAQItem({
  question,
  answer,
  cardColor = '#1F2121',
  textColor = '#26D968',
  isOpen = false,
  onToggle,
}: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const containerStyle: CSSProperties = {
    borderRadius: '8px',
    transition: 'all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid rgba(38, 217, 104, 0.2)',
    backgroundColor: '#2A2A2A',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      onClick={handleToggle}
      className="faq-item"
      style={containerStyle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-expanded={isExpanded}
    >
      {/* Question Section - Title Bar */}
      <div
        style={{
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          backgroundColor: '#2A2A2A',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 2vw, 1rem)',
          transition: 'all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        {/* Terminal Bash Circles - Left Side */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(0.4rem, 1.5vw, 0.6rem)',
            flexShrink: 0,
          }}
        >
          {/* Red Circle - Close */}
          <div
            style={{
              width: 'clamp(8px, 2.2vw, 14px)',
              height: 'clamp(8px, 2.2vw, 14px)',
              borderRadius: '50%',
              backgroundColor: '#FF5F56',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          />
          {/* Yellow Circle - Minimize */}
          <div
            style={{
              width: 'clamp(8px, 2.2vw, 14px)',
              height: 'clamp(8px, 2.2vw, 14px)',
              borderRadius: '50%',
              backgroundColor: '#FFBD2E',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          />
          {/* Green Circle - Maximize */}
          <div
            style={{
              width: 'clamp(8px, 2.2vw, 14px)',
              height: 'clamp(8px, 2.2vw, 14px)',
              borderRadius: '50%',
              backgroundColor: '#27C93F',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>

        {/* Question Text */}
        <h3
          style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
            fontWeight: 500,
            color: textColor,
            margin: 0,
            lineHeight: '1.4rem',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            flex: 1,
            minWidth: 0,
          }}
        >
          {question}
        </h3>

        {/* Arrow Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.2rem',
            height: '1.2rem',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
            flexShrink: 0,
            color: textColor,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Answer - Expandable */}
      <div
        style={{
          maxHeight: isExpanded ? '1200px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
          backgroundColor: '#161616',
        }}
      >
        <div
          style={{
            padding: 'clamp(0.75rem, 2vw, 1rem)',
            borderTopWidth: '1px',
            borderTopColor: 'rgba(38, 217, 104, 0.15)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              color: textColor,
              opacity: 0.9,
              margin: 0,
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              letterSpacing: '0.3px',
            }}
          >
            {answer}
          </p>
        </div>
      </div>

      <style>{`
        .faq-item:hover {
          border-color: rgba(38, 217, 104, 0.35);
          background-color: rgba(42, 42, 42, 0.8);
          transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .faq-item:focus-visible {
          outline: 2px solid ${textColor};
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .faq-item {
            border-radius: 6px;
          }
        }
      `}</style>
    </div>
  );
}
