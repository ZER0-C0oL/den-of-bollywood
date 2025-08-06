import React from 'react';

interface FaceMashImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const FaceMashImage: React.FC<FaceMashImageProps> = ({
  src,
  alt = "Mashed face",
  className = "w-64 h-64 object-cover rounded-lg shadow-lg"
}) => {
  return (
    <div className="flex-shrink-0">
      <img 
        src={src} 
        alt={alt}
        className={className}
      />
    </div>
  );
};

export default FaceMashImage;
