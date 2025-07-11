import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-xl'
  };

  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full bg-indigo-500 flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <span className="text-white font-semibold">{initial}</span>
    </div>
  );
};

export default Avatar;