import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import cx from "classnames";
import Button from "@/components/Buttons/Button/Button";
import IconCross from "@/assets/images/icons/IconCrossBlue";
import { Key } from "@/constants/DOM";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface ModalProps {
  className?: string;
  width?: string;
  height?: string;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  icon?: React.ReactNode;
  title?: string | React.ReactNode;
  showTitle?: boolean;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  hasOverlay?: boolean;
  useShadowBackground?: boolean;
  closeOnClickOut?: boolean;
  showFooter?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  footerClassName?: string;
  onClose?: () => void;
}

const defaultProps: ModalProps = {
  className: undefined,
  width: undefined,
  height: undefined,
  position: undefined,
  icon: undefined,
  title: undefined,
  isOpen: false,
  setIsOpen: undefined,
  hasOverlay: true,
  useShadowBackground: true,
  closeOnClickOut: true,
  showFooter: true,
  footer: undefined,
  children: undefined,
  onClose: undefined,
};

const Modal = ({
  className,
  width,
  height,
  position,
  icon,
  title,
  showTitle = true,
  isOpen,
  setIsOpen,
  hasOverlay,
  useShadowBackground,
  closeOnClickOut,
  showFooter,
  footer,
  children,
  footerClassName,
  onClose,
}: ModalProps) => {
  const [opened, setOpened] = useState(isOpen);

  const close = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
    setOpened(false);
    onClose?.();
  };

  useEffect(() => {
    setOpened(isOpen);
  }, [isOpen]);

  // prevent Suppr from triggering Graph's "delete selected entities"
  useEffect(() => {
    const preventSuppr = (e) => {
      const { target } = e;
      if (
        e.key === Key.Delete &&
        !(
          target &&
          (target.tagName === "TEXTAREA" || target.tagName === "INPUT")
        )
      ) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.body.addEventListener("keydown", preventSuppr);
    return () => {
      document.body.removeEventListener("keydown", preventSuppr);
    };
  }, []);

  return createPortal(
    <>
      {opened && (
        <>
          {hasOverlay && (
            <div
              className={cx(styles.modalContainer, {
                [styles.modalShadow]: useShadowBackground,
              })}
              onClick={closeOnClickOut ? close : undefined}
            />
          )}
          <div
            className={cx(styles.modal, className)}
            style={{
              width,
              height,
              top: position?.top,
              bottom: position?.bottom,
              left: position?.left,
              right: position?.right,
            }}
          >
            {showTitle && (
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderTitle}>
                  {icon}
                  {title}
                </div>
                <button type="button" onClick={close}>
                  <IconCross fill="#FFFFFF" />
                </button>
              </div>
            )}
            <div className={cx(styles.modalContent, commons.PrettyScroll)}>
              {children}
            </div>
            {showFooter && (
              <div className={cx(footerClassName, styles.modalFooter)}>
                {footer ? (
                  <>{footer}</>
                ) : (
                  <Button onClick={close} type="secondary">
                    Annuler
                  </Button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>,
    document.getElementById("root") as Element
  );
};

Modal.defaultProps = defaultProps;

export default Modal;
