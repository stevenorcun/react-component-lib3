import React from 'react';
import { STYLE_BY_FILL_COLORS } from '@/constants/graph-themes';

const IconSmartPhone = (props: React.SVGProps<SVGSVGElement> = {}) => (
  <svg
    width="24"
    height="40"
    viewBox="0 0 24 40"
    fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18.333 0H5C2.24902 0 0 2.24951 0 5V35C0 37.751 2.24902 40 5 40H18.333C21.084 40 23.333 37.751 23.333 35V5C23.333 2.24951 21.084 0 18.333 0ZM20 35C20 35.9035 19.2365 36.667 18.333 36.667H5C4.09648 36.667 3.33301 35.9035 3.33301 35V5C3.33301 4.09648 4.09648 3.3335 5 3.3335H6.6665V4.16699C6.6665 5.0835 7.41699 5.8335 8.33301 5.8335H15C15.916 5.8335 16.6665 5.0835 16.6665 4.16699V3.3335H18.333C19.2365 3.3335 20 4.09697 20 5V35Z" />
  </svg>
);

export default IconSmartPhone;
