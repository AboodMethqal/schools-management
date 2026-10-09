import React from 'react';

const WindowsIcon = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
    >
      {/* Windows Logo Path */}
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.551h-13.051M0 12.45h9.75V21.9L0 20.551m10.949-8.102H24V24l-13.051-1.849" />
    </svg>
  );
};

export default WindowsIcon;
