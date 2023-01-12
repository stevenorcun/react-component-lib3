import React, { useRef, useState } from "react";
import cx from "classnames";

import Notification from "../../../components/Notification/Notification";

import IconBell from "../../../assets/images/icons/IconBellNav";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";
import NoData from "../../../lib/NoData/NoData";

interface AuxProps {
  className?: string;
}

const Notifications = ({ className }: AuxProps) => {
  const container = useRef<HTMLDivElement>(null);

  const [isOpened, setOpen] = useState(false);
  const [notifs] = useState([]);

  const toggleOpen = () => {
    setOpen(!isOpened);
  };

  return (
    <div ref={container} className={cx(styles.container, className)}>
      <IconBell onClick={toggleOpen} withBadge className={commons.clickable} />
      {isOpened && (
        <div className={cx(styles.panel)}>
          <p className={styles.title}>Notifications</p>

          {notifs?.length ? (
            <>
              <div className={styles.notifications}>
                {notifs.map((notif) => (
                  <>
                    <Notification data={notif} />
                  </>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.nodata}>
                <NoData>Aucune notification</NoData>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
