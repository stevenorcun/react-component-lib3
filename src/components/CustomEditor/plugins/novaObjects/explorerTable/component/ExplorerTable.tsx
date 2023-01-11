import React from "react";
import ArrayExplorerContent from "@/components/Explorer/ArrayExplorer/ArrayExplorerContent";
import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

const ExplorerTable = React.forwardRef(
  ({ contentState, blockProps, className, onClick, style }: any, ref: any) => {
    const { entityKey } = blockProps;
    const data = contentState.getEntity(entityKey).getData();

    return (
      <div
        ref={ref}
        className={cx(styles.explorerMode, commons.PrettyScroll, className)}
        style={{ ...style }}
        onClick={onClick}
        data-contextmenu
      >
        <ArrayExplorerContent explorer={data} />
      </div>
    );
  }
);

export default ExplorerTable;
