import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Link: React.FC<any> = ({ href, children, className, ...props }) => {
  // Strip non-DOM attributes if any
  const { prefetch, replace, scroll, shallow, passHref, ...restProps } = props;
  return (
    <RouterLink to={href || '#'} className={className} {...restProps}>
      {children}
    </RouterLink>
  );
};

export const Image: React.FC<any> = ({
  src,
  alt = '',
  width,
  height,
  className,
  fill,
  priority,
  children, // explicitly strip children to prevent void element error
  quality,
  placeholder,
  blurDataURL,
  unoptimized,
  loader,
  ...props
}) => {
  const combinedClassName = `${fill ? 'absolute inset-0 w-full h-full object-cover' : ''} ${className || ''}`.trim();

  return (
    <img
      src={typeof src === 'string' ? src : src?.src || ''}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={combinedClassName || undefined}
      {...props}
    />
  );
};

export default Image;
