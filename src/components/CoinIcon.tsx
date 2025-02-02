import React from 'react';
import { Hexagon } from 'lucide-react';

const CoinIcon = ({ className = '', size = 20 }) => {
  return (
    <div className="relative">
      <svg width={size} height={size} className={className}>
        <defs>
          <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#7C3AED' }} />
            <stop offset="50%" style={{ stopColor: '#4F46E5' }} />
            <stop offset="100%" style={{ stopColor: '#00E0FF' }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g fill="url(#coinGradient)" filter="url(#glow)">
          <Hexagon size={size} />
        </g>
      </svg>
    </div>
  );
};

export default CoinIcon;