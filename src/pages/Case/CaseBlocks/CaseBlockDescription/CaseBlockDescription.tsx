import React from "react";
import Moment from "react-moment";

import IconBars from "@/assets/images/icons/IconBars";

import InfoBlock from "@/components/InfoBlock/InfoBlock";

import cx from "classnames";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface CaseDescriptionProps {
  value?: string;
  createdAt?: Date;
}

const defaultProps = {
  value: "",
  createdAt: undefined,
};

const CaseBlockDescription = ({ value, createdAt }: CaseDescriptionProps) => {
  return (
    <InfoBlock
      icon={<IconBars />}
      title="Description de l'affaire"
      subTitle={
        createdAt && (
          <>
            Rédigé le{" "}
            <Moment format="DD MMMM YYYY" unix>
              {createdAt}
            </Moment>
          </>
        )
      }
      // @ts-ignore
      options
    >
      <p className={cx(commons.fontSmall, styles.description)}>{value}</p>
    </InfoBlock>
  );
};

CaseBlockDescription.defaultProps = defaultProps;

export default CaseBlockDescription;
