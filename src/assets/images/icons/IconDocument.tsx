import * as React from 'react';
import { STYLE_BY_FILL_COLORS } from '@/constants/graph-themes';

function SvgIconNationality(props: React.SVGProps<SVGSVGElement> = {}) {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.05 1.94141H4.95L0 7.88141V13.6414C0 15.1714 1.17 16.3414 2.7 16.3414H15.3C16.83 16.3414 18 15.1714 18 13.6414V7.88141L13.05 1.94141ZM5.85 3.74141H12.24L15.21 7.34141H2.79L5.85 3.74141ZM15.3 14.5414H2.7C2.16 14.5414 1.8 14.1814 1.8 13.6414V9.14141H16.2V13.6414C16.2 14.1814 15.84 14.5414 15.3 14.5414Z" />
      <path d="M7.20015 10.9414H10.8002V12.7414H7.20015V10.9414Z" />
    </svg>
  );
}

export default SvgIconNationality;
