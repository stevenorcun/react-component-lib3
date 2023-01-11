import React from "react";
import cx from "classnames";

import IconCross from "@/assets/images/icons/IconCrossBlue";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";

const RemoveButton = ({ handleDelete }: { handleDelete: () => void }) => (
  <button
    className={cx(commons.Flex, commons.FlexAlignItemsCenter)}
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      handleDelete();
    }}
  >
    <IconCross />
  </button>
);

export default RemoveButton;
