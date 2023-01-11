import * as React from 'react';

function SvgIconDezoom(props) {
  return (
    <svg
      width="31"
      height="30"
      viewBox="0 0 31 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M30.5117 27.4392L22.4044 19.3453C23.9895 17.3143 24.9421 14.7688 24.9421 11.9998C24.9421 5.38343 19.5496 0 12.9222 0C6.29475 0 0.902344 5.38343 0.902344 11.9998C0.902344 18.6163 6.29475 23.9997 12.9222 23.9997C15.6958 23.9997 18.244 23.0472 20.2799 21.4677L28.3872 29.5616C28.6802 29.8526 29.0649 29.9996 29.4495 29.9996C29.8341 29.9996 30.2188 29.8526 30.5117 29.5601C31.0992 28.9736 31.0992 28.0256 30.5117 27.4392ZM3.90731 11.9998C3.90731 7.03641 7.95049 2.99996 12.9222 2.99996C17.8939 2.99996 21.9371 7.03641 21.9371 11.9998C21.9371 16.9633 17.8939 20.9997 12.9222 20.9997C7.95049 20.9997 3.90731 16.9633 3.90731 11.9998Z"
        fill={props.fill ? 'current' : '#94969A'}
      />
      <path
        d="M8.41475 10.4999H17.4296C18.259 10.4999 18.9321 11.1704 18.9321 11.9998C18.9321 12.8293 18.259 13.4998 17.4296 13.4998H8.41475C7.58538 13.4998 6.91227 12.8293 6.91227 11.9998C6.91227 11.1704 7.58538 10.4999 8.41475 10.4999Z"
        fill={props.fill ? 'current' : '#94969A'}
      />
    </svg>
  );
}

export default SvgIconDezoom;