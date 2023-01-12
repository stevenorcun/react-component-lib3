import React from "react";
import { useNavigate } from "react-router-dom";

import { EntityDto } from "../../../../../../API/DataModels/Database/NovaObject";
import { useAppDispatch } from "../../../../../../store/hooks";
import { createTabByType } from "../../../../../../store/browser";
import { APP_ROUTES } from "../../../../../../constants/routes";
import { BrowserTabType } from "../../../../../../constants/browser-related";

import BrowserSearchResult from "../../../../../../components/Browser/SearchResult/SearchResult";

import cx from "classnames";
import styles from "./styles.scss";

const CardEntity = React.forwardRef(
  (
    { contentState, blockProps, block, className, onClick, style }: any,
    ref: any
  ) => {
    const { entityKey, setContextMenuEntityProps } = blockProps;
    const data = contentState.getEntity(entityKey).getData();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const openInNewTab = (e: React.MouseEvent, entity: EntityDto) => {
      e.stopPropagation();
      dispatch(
        createTabByType({
          value: entity.label,
          type: BrowserTabType.EntityDetails,
          activeEntity: entity,
          isActive: true,
        })
      );
    };

    const navigateTo = (screen: string) => {
      navigate(screen);
    };

    const handleOpen = (e: React.MouseEvent) => {
      openInNewTab(e, data);
      navigateTo(APP_ROUTES.browser.path);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenuEntityProps({
        entityKey,
        contentBlock: block,
      });
    };

    return (
      <div
        ref={ref}
        className={cx(styles.cardMode, className)}
        style={{ ...style }}
        onContextMenu={handleContextMenu}
        onClick={onClick}
        data-contextmenu
      >
        <BrowserSearchResult
          entity={data}
          isSelected={false}
          hideCheckbox
          handleClick={() => {}}
          handleSelect={() => {}}
          handleDragStart={() => {}}
          handleOpen={handleOpen}
        />
      </div>
    );
  }
);

export default CardEntity;
