import React from "react";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import cx from "classnames";
import styles from "./styles.scss";

interface NotificationProps {
  className?: string;
  withBadge?: boolean;
  data: any;
}

const defaultProps: NotificationProps = {
  withBadge: false,
  className: "",
  data: {},
};

const Notification = ({ data, withBadge, className }: NotificationProps) => (
  <>
    <div className={cx(styles.notification, className)}>
      <div className={cx(styles.title, { [styles.badge]: withBadge })}>
        Nouvelle affaire : <b>Panama papers - Paris - Rue de la paix 75000</b>.
      </div>
      <div className={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit...
      </div>
      <div className={cx(styles.link, commons.clickable)}>Ouvrir l'affaire</div>
      <div className={styles.time}>Il y a 3 heures</div>
    </div>
  </>
);

Notification.defaultProps = defaultProps;

export default Notification;
