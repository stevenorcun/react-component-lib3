import React from "react";
import { STYLE_BY_FILL_COLORS } from "../../../../constants/graph-themes";

const IconMetro = (props: React.SVGProps<SVGSVGElement> = {}) => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill={STYLE_BY_FILL_COLORS.DEFAULT_STYLE.blueByDefault}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.8053 12.066C11.6707 12.1673 11.512 12.218 11.3293 12.218C11.168 12.218 11.0153 12.1673 10.8707 12.066C10.7253 11.9647 10.6527 11.8173 10.6527 11.626V6.41733H10.6373L8.648 10.4553C8.58831 10.5851 8.50067 10.7001 8.39133 10.792C8.29467 10.8667 8.16667 10.904 8.006 10.904C7.846 10.904 7.71733 10.8667 7.62133 10.792C7.51182 10.7002 7.42414 10.5852 7.36467 10.4553L5.37533 6.418H5.36V11.6253C5.36386 11.712 5.34504 11.7982 5.3054 11.8753C5.26577 11.9525 5.20669 12.018 5.134 12.0653C4.99769 12.1627 4.83483 12.216 4.66733 12.218C4.484 12.218 4.32867 12.1673 4.19933 12.066C4.07067 11.9647 4.006 11.8173 4.006 11.626V4.63867C4.006 4.436 4.07 4.246 4.19933 4.07C4.32733 3.894 4.55733 3.806 4.89 3.806C5.13667 3.806 5.32667 3.862 5.46067 3.974C5.594 4.08667 5.714 4.25467 5.822 4.47867L8.00667 8.98133H8.02267L10.1913 4.47867C10.298 4.25467 10.4193 4.08667 10.5533 3.974C10.6867 3.862 10.8767 3.806 11.1233 3.806C11.4553 3.806 11.686 3.894 11.814 4.07C11.9427 4.24667 12.0073 4.43667 12.0073 4.63933V11.6247C12.0073 11.8167 11.94 11.964 11.806 12.0647L11.8053 12.066ZM7.984 14.8367C11.756 14.8367 14.8367 11.7433 14.8367 7.952C14.8367 4.20533 11.768 1.16333 7.984 1.16333C4.20133 1.16333 1.164 4.18733 1.164 7.952C1.164 11.6787 4.30733 14.8367 7.984 14.8367ZM7.984 16C3.66333 16 0 12.32 0 7.952C0 3.54333 3.56 0 7.984 0C12.4087 0 16 3.56 16 7.952C16 12.3847 12.4 16 7.984 16Z"
      fill="#113E9F"
    />
  </svg>
);

export default IconMetro;
