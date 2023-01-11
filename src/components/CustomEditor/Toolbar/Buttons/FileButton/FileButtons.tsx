import React, { useRef } from "react";
import BaseButton from "@/components/CustomEditor/Toolbar/Buttons/BaseButton/BaseButton";
import styles from "./styles.scss";

interface FileButtonProps {
  className?: string;
  onClick: any;
  icon?: React.ReactNode;
  tooltip?: string;
}

const FileButton = ({ className, onClick, icon, tooltip }: FileButtonProps) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const click = (e) => {
    e.preventDefault();
    if (fileInput?.current) {
      fileInput.current.click();
    }
  };

  const resetValue = () => {
    if (fileInput?.current) {
      fileInput.current.value = "";
    }
  };

  const change = (e) => {
    const { files } = e.target;
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    onClick(file);
  };

  return (
    <>
      <BaseButton onClick={click} icon={icon} tooltip={tooltip} />
      <input
        ref={fileInput}
        className={styles.fileInput}
        type="file"
        accept="image/*"
        onClick={resetValue}
        onChange={change}
      />
    </>
  );
};

export default FileButton;
