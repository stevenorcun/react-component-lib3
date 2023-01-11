import React from 'react';

function SvgIconToolColorText(props: React.SVGProps<SVGSVGElement> = {}) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="#4D5056" xmlns="http://www.w3.org/2000/svg" {...props} stroke="#4D5056">
      <path d="M19.8816 16.6347L13.9817 1.06976C13.7363 0.423097 13.1505 0 12.5002 0C11.8498 0 11.2637 0.423097 11.0186 1.07011L5.11841 16.6347C4.78538 17.5132 5.17888 18.5153 5.99722 18.8725C6.19461 18.959 6.39872 18.9995 6.5993 18.9995C7.23082 18.9995 7.82906 18.5957 8.08148 17.9294L9.50638 14.1707H15.4936L16.9185 17.9294C17.2509 18.8075 18.1841 19.231 19.0031 18.8725C19.8211 18.5149 20.2146 17.5128 19.8816 16.6347ZM10.8084 10.7361L12.5002 6.27296L14.1919 10.7361H10.8084Z" />
      <line x1="1.5" y1="23.5" x2="23.5" y2="23.5" strokeWidth="5" strokeLinecap="round" stroke={props.stroke} />
    </svg>
  );
}

export default SvgIconToolColorText;
