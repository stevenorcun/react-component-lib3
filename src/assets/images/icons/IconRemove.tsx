import React from 'react';

function SvgIconRemove(props: React.SVGProps<SVGSVGElement> = {}) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="#4D5056"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M23.25 3.75H17C17 1.6825 15.3175 0 13.25 0C11.1825 0 9.5 1.6825 9.5 3.75H3.25C2.56 3.75 2 4.30875 2 5C2 5.69125 2.56 6.25 3.25 6.25H4.5V21.25C4.5 23.3175 6.1825 25 8.25 25H18.25C20.3175 25 22 23.3175 22 21.25V6.25H23.25C23.9412 6.25 24.5 5.69125 24.5 5C24.5 4.30875 23.9412 3.75 23.25 3.75ZM13.25 2.5C13.9387 2.5 14.5 3.06 14.5 3.75H12C12 3.06 12.5612 2.5 13.25 2.5ZM19.5 21.25C19.5 21.94 18.94 22.5 18.25 22.5H8.25C7.56125 22.5 7 21.94 7 21.25V6.25H19.5V21.25Z" />
      <path d="M10.75 20C11.44 20 12 19.4412 12 18.75V10C12 9.30875 11.44 8.75 10.75 8.75C10.06 8.75 9.5 9.30875 9.5 10V18.75C9.5 19.4412 10.06 20 10.75 20Z" />
      <path d="M15.75 20C16.4412 20 17 19.4412 17 18.75V10C17 9.30875 16.4412 8.75 15.75 8.75C15.0588 8.75 14.5 9.30875 14.5 10V18.75C14.5 19.4412 15.0588 20 15.75 20Z" />
    </svg>
  );
}

export default SvgIconRemove;