import React, { useState, useEffect, Fragment } from "react";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

import { useAppSelector } from "../../../../store/hooks";
import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";
import ModalTypes from "../../../../constants/modal";
import { preventDefault } from "../../../../utils/DOM";
import { handleEntityOrSummaryDrop } from "../../../../utils/drag-events";
import { selectToken } from "../../../../store/token";
import { getUserInfo } from "../../../../store/token/actions";
import { APP_ROUTES } from "../../../../constants/routes";

import ModalProfile from "../../../../components/Modal/components/ModalProfile/ModalProfile";
import ModalLists from "../../../../components/Modal/components/ModalLists/ViewModalList/ModalLists";
import NavigationItem from "../../../../components/Navigation/NavigationItem";
import Notifications from "../../../../containers/Header/Notifications/Notifications";

import IconList from "../../../../assets/images/icons/IconList";
import IconArrowDown from "../../../../assets/images/icons/IconArrowDown";
import IconSettings from "../../../../assets/images/icons/IconSettings";
import IconSearch from "../../../../assets/images/icons/IconSearch";

import styles from "./rightNavigation.scss";
import stylesGlobal from "../styles.scss";

const RightNavigation = ({
  activeMenu,
  openInNewWindow,
  navigateTo,
  caseState,
}: any) => {
  const tokenState = useAppSelector(selectToken);
  const [userInitials, setUserInitials] = useState<string>("");
  const { showModal } = useGlobalModalContext();

  const itemsLeft = [
    // {
    //   id: 0,
    //   icon: <IconPlusRound fill="white" className={commons.clickable} />,
    // },
    // {
    //   id: 1,
    //   icon: <IconUpload fill="white" className={commons.clickable} />,
    // },
    {
      id: 2,
      route: APP_ROUTES.settings.path,
      icon: <IconSettings className={commons.clickable} />,
      alwaysShow: true,
    },
  ];

  const [isOpenModalList, setIsOpenModalList] = useState(false);
  const openModalList = () => {
    setIsOpenModalList(!isOpenModalList);
  };

  const onCloseList = () => {
    setIsOpenModalList(false);
  };

  const [isOpenModalProfile, setIsOpenModalProfile] = useState(false);
  const openModalProfile = () => {
    setIsOpenModalProfile(!isOpenModalProfile);
  };

  const itemsRight = [
    /* {
       id: 0,
       route: APP_ROUTES.inbox.path,
       clickable: true,
       onDragStart: (e) => openInNewWindow(e, APP_ROUTES.inbox.path),
       onClick: () => navigateTo(APP_ROUTES.inbox.path),
       icon: <IconMail withBadge />,
       alwaysShow: true,
       className: styles.NavItem,
     },
     {
       id: 1,
       route: APP_ROUTES.faq.path,
       clickable: true,
       onDragStart: (e) => openInNewWindow(e, APP_ROUTES.faq.path),
       onClick: () => navigateTo(APP_ROUTES.faq.path),
       icon: <IconFAQ />,
       alwaysShow: true,
     }, */
    {
      id: 2,
      title: "lists",
      route: APP_ROUTES.list.path,
      icon: <IconList className={commons.clickable} />,
      onClick: openModalList,
      alwaysShow: true,
      className: stylesGlobal.NavItem,
      onDragEnter: preventDefault,
      onDrop: (e) => {
        handleEntityOrSummaryDrop(e, (entities) => {
          showModal(ModalTypes.LISTS_ADD_TO_LIST, { entities });
        });
      },
    },
    {
      id: 3,
      icon: <Notifications />,
      alwaysShow: true,
    },
    {
      id: 4,
      className: styles.itemRow,
      clickable: true,
      onClick: openModalProfile,
      icon: (
        <>
          <div className={styles.userDetails}>{userInitials}</div>
          <IconArrowDown fill="#fff" className={commons.clickable} />
        </>
      ),
      alwaysShow: true,
    },
  ];

  useEffect(() => {
    const user = getUserInfo(tokenState);
    if (user) {
      const initials = `${user.given_name
        ?.substring(0, 1)
        .toUpperCase()}${user.family_name?.substring(0, 1).toUpperCase()}`;
      setUserInitials(initials);
    }
  }, [tokenState.token]);

  return (
    <div className={cx(stylesGlobal.itemsContainer, styles.rightNavigation)}>
      {itemsLeft.map((item) => (
        <Fragment key={item.id}>
          {(caseState.currentCase || item.alwaysShow) && (
            <NavigationItem
              icon={item.icon}
              active={item.route ? activeMenu === item.route : undefined}
              // @ts-ignore
              onClick={
                item.route
                  ? () => {
                      navigateTo(item.route);
                    }
                  : undefined
              }
              className={styles.tertiary}
            />
          )}
        </Fragment>
      ))}
      {caseState.currentCase && (
        <>
          {/* <div className={cx(styles.item, styles.divider)} />
          <div className={cx(styles.item, styles.itemRow)}>
            <p className={cx(styles.counter)}>34</p>
            <div className={cx(styles.arrow)}>
              <IconArrowDownLong fill="white" />
            </div>
            <p className={cx(styles.counter)}>56</p>
            <div className={cx(styles.arrow)}>
              <IconArrowUpLong fill="white" />
            </div>
          </div> */}
          <div className={cx(styles.searchControls)}>
            <input className={styles.searchInput} placeholder="Rechercher" />
            <div className={cx(styles.searchBtn, commons.clickable)}>
              <IconSearch fill="#fff" />
            </div>
          </div>
        </>
      )}
      {itemsRight.map((item) => (
        <Fragment key={item.id}>
          {(caseState.currentCase || item.alwaysShow) && (
            <NavigationItem
              className={cx(item.className, styles.secondary)}
              clickable={item.clickable}
              active={
                (item.route && activeMenu === item.route) ||
                (isOpenModalList && item.title === "lists")
              }
              // @ts-ignore
              onDragStart={item.onDragStart}
              // @ts-ignore
              onClick={item.onClick}
              icon={item.icon}
              // @ts-ignore
              onDragEnter={item.onDragEnter}
              // @ts-ignore
              onDrop={item.onDrop}
            />
          )}
        </Fragment>
      ))}
      {isOpenModalList && (
        <ModalLists openModalList={openModalList} onClose={onCloseList} />
      )}
      {isOpenModalProfile && (
        <ModalProfile openModalProfile={openModalProfile} />
      )}
    </div>
  );
};

export default RightNavigation;
