import React from 'react';
import { STYLE_BY_FILL_COLORS } from '@/constants/graph-themes';

function ObjectDefault(props: React.SVGProps<SVGSVGElement> = {}) {
    return (
        <svg  width="85"
        height="80"
        viewBox="0 0 26 25"
            fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.9086 5.10775L13.6587 0.107811C13.335 -0.0359371 12.9662 -0.0359371 12.6425 0.107811L1.39261 5.10775C0.942613 5.309 0.651367 5.75649 0.651367 6.25023V18.7501C0.651367 19.2438 0.942614 19.6913 1.39386 19.8926L12.6437 24.8925C12.805 24.9637 12.9787 25 13.1512 25C13.3237 25 13.4975 24.9637 13.6587 24.8925L24.9086 19.8926C25.3598 19.6913 25.6511 19.2438 25.6511 18.7501V6.25023C25.6511 5.75649 25.3598 5.309 24.9086 5.10775ZM13.1512 2.61778L21.3236 6.25023L13.1512 9.88269L4.97881 6.25023L13.1512 2.61778ZM3.15134 8.17396L11.9012 12.0627V21.8275L3.15134 17.9376V8.17396ZM14.4012 21.8263V12.0614L23.1511 8.17271V17.9376L14.4012 21.8263Z" />
        </svg>
    );
}

export default ObjectDefault;
