import React from 'react';

import styles from './headerSubtitleIcon.scss';

interface HeaderSubtitleIconProps {
  title: string;
  icon?: React.ReactNode;
  handleDragStart?: React.DragEventHandler;
}

const HeaderSubtitleIcon = ({
  title,
  icon,
  handleDragStart,
}: HeaderSubtitleIconProps) => (
  <div
    draggable={!!handleDragStart}
    onDragStart={handleDragStart}
    className={styles.relatedHeader}
  >
    <div className={styles.icon}>{icon}</div>
    <span className={styles.relatedHeaderTitle}>{title}</span>
  </div>
);

export default HeaderSubtitleIcon;
