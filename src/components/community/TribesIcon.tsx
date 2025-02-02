import React from 'react';

const TribesIcon = ({ className = '' }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M12 2L2 19h20L12 2zm0 4l6.9 11H5.1L12 6z" />
  </svg>
);

export default TribesIcon;