import React from "react";

import {
  getObjectTypeLabel,
  getObjectTypeStrIcon,
} from "@/constants/entity-related";

import IconArrow from "@/assets/images/icons/IconArrowUp";
import IconArrowDown from "@/assets/images/icons/IconArrowDown";

import { selectOntologyConfig } from "@/store/ontology";
import { useAppSelector } from "@/store/hooks";
import { ICON_STORE } from "@/assets/images/icons/icon-store";
import styles from "./componentSubtitle.scss";

interface ComponentSubtitleProps {
  title: string;
  iconName: string;
  numberLink?: string;
  isOpen: boolean;
  type: string;
  setIsOpen: any;
}

const ComponentSubtitle = ({
  title,
  iconName,
  numberLink,
  isOpen,
  setIsOpen,
  type,
}: ComponentSubtitleProps) => {
  const ontologyStore = useAppSelector(selectOntologyConfig);
  const typeStrIcon = getObjectTypeStrIcon(+type, ontologyStore.ont);
  // @ts-ignore
  const Icon = ICON_STORE[typeStrIcon] || ICON_STORE.DEFAULT;

  return (
    <div className={styles.generalPropertyHeader}>
      <div className={styles.generalPropertyHeaderLeft}>
        <div className={styles.icon}>{Icon && <Icon />}</div>
        <p className={styles.title}>
          {getObjectTypeLabel(+title, ontologyStore.ont) || title}
          <span className={styles.numberLink}>{numberLink}</span>
        </p>
      </div>
      <button
        className={styles.buttonOpen}
        type="button"
        onClick={() => setIsOpen(type, isOpen)}
      >
        {isOpen ? (
          <IconArrow fill="#113E9F" transform="scale(1.7)" />
        ) : (
          <IconArrowDown fill="#113E9F" transform="scale(1.7)" />
        )}
      </button>
    </div>
  );
};

export default ComponentSubtitle;
