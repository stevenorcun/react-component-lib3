import React from 'react';
import { STYLE_BY_FILL_COLORS } from '@/constants/graph-themes';

function PropDefault(props: React.SVGProps<SVGSVGElement> = {}) {
    return (
        <svg
            width="85"
            height="80"
            viewBox="0 0 26 25"
            fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M19.4685 3.26087C20.7207 3.26087 21.7391 4.27989 21.7391 5.53152V19.4696C21.7391 20.7212 20.7207 21.7391 19.4685 21.7391H5.53152C4.27935 21.7391 3.26087 20.7212 3.26087 19.4685V5.53152C3.26087 4.27989 4.27935 3.26087 5.53152 3.26087H19.4685ZM19.4685 0H5.53152C2.47663 0 0 2.47663 0 5.53152V19.4696C0 22.5234 2.47663 25 5.53152 25H19.469C22.5234 25 25 22.5234 25 19.4685V5.53152C25 2.47663 22.5234 0 19.4685 0Z" />
        </svg>
    );
}

export default PropDefault;
