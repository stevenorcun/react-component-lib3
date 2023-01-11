import React from "react";
import BaseButton from "@/components/CustomEditor/Toolbar/Buttons/BaseButton/BaseButton";

interface StyleButtonProps {
  active: boolean;
  onToggle: any;
  style: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

const StyleButton = ({
  active,
  onToggle,
  style,
  icon,
  tooltip,
}: StyleButtonProps) => {
  const toggle = () => {
    onToggle(style);
  };

  return (
    <BaseButton
      active={active}
      icon={icon}
      onClick={toggle}
      tooltip={tooltip}
    />
  );
};

export default StyleButton;
