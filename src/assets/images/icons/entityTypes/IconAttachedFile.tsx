import React from 'react';
import { STYLE_BY_FILL_COLORS } from '@/constants/graph-themes';

const IconAttachedFile = (props: React.SVGProps<SVGSVGElement> = {}) => (
  <svg
    width="33"
    height="40"
    viewBox="0 0 33 40"
    fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M31.6142 10.586L21.6142 0.586C21.2402 0.21 20.7302 0 20.2002 0H4.2002C1.9942 0 0.200195 1.794 0.200195 4V36C0.200195 38.206 1.9942 40 4.2002 40H28.2002C30.4062 40 32.2002 38.206 32.2002 36V12C32.2002 11.468 31.9902 10.96 31.6142 10.586ZM22.2002 6.828L25.3722 10H22.2002V6.828ZM4.2002 36V4H18.2002V10C18.2002 12.206 19.9942 14 22.2002 14H28.2002L28.1942 36H4.2002Z" />
  </svg>
);

export default IconAttachedFile;
