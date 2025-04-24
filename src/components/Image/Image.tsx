import React from "react";

export interface LogoProps {
  src: string;
  width?: number | string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ src, width = 250, alt = "logo" }) => {
  const size = typeof width === "number" ? `${width}px` : width;
  return <img src={src} alt={alt} style={{ width: size }} />;
};

export default Logo;
