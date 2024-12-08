import React from "react";

interface CatalogIconProps {
  className?: string;
}

export const CatalogIcon: React.FC<CatalogIconProps> = ({ className = "" }) => {
  return (
    <svg className={className} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 36.25H15V38.75H40V36.25Z" />
      <path d="M40 31.25H15V33.75H40V31.25Z" />
      <path d="M40 21.25H15V23.75H40V21.25Z" />
      <path d="M40 16.25H15V18.75H40V16.25Z" />
      <path d="M40 6.25H15V8.75H40V6.25Z" />
      <path d="M40 1.25H15V3.75H40V1.25Z" />
      <path d="M8.75 30H1.25C0.56 30 0 30.56 0 31.25V38.75C0 39.44 0.56 40 1.25 40H8.75C9.44 40 10 39.44 10 38.75V31.25C10 30.56 9.44 30 8.75 30ZM7.5 37.5H2.5V32.5H7.5V37.5Z" />
      <path d="M8.75 15H1.25C0.56 15 0 15.56 0 16.25V23.75C0 24.44 0.56 25 1.25 25H8.75C9.44 25 10 24.44 10 23.75V16.25C10 15.56 9.44 15 8.75 15ZM7.5 22.5H2.5V17.5H7.5V22.5Z" />
      <path d="M8.75 0H1.25C0.56 0 0 0.56 0 1.25V8.75C0 9.44 0.56 10 1.25 10H8.75C9.44 10 10 9.44 10 8.75V1.25C10 0.56 9.44 0 8.75 0ZM7.5 7.5H2.5V2.5H7.5V7.5Z" />
    </svg>
  );
};
