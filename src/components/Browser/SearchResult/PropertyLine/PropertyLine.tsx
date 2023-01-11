import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import Moment from "react-moment";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconGraphNetwork from "@/assets/images/icons/IconGraphNetwork";
import IconGeoSlim from "@/assets/images/icons/IconGeoSlim";
import COUNTRY_DETAILS from "@/assets/images/icons/flags";
import { ENTITY_GENDER_DETAILS } from "@/constants/entity-related";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import styles from "./PropertyLine.scss";

interface AdvancedSearchResultPropertyLineProps {
  label: string;
  value: any;
  propertyKey: keyof EntityDto;
  className?: string | string[];
  labelClassName?: string | string[];
  valueClassName?: string | string[];
}

const AdvancedSearchResultPropertyLine = ({
  label,
  value,
  propertyKey,
  className,
  labelClassName,
  valueClassName,
}: AdvancedSearchResultPropertyLineProps) => {
  const valueRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const createElementFromValue = (v: any): JSX.Element | undefined => {
    if (typeof v === "string" || typeof v === "number") {
      return <span>{v}</span>;
    }
    if (v && v.label && typeof v.label === "string") {
      return <span>{v.label}</span>;
    }
    if (v && v.value && typeof v.value === "string") {
      return <span>{v.value}</span>;
    }
    if (Array.isArray(v)) {
      if (v.every((val) => typeof val === "string")) {
        return <span>{v.join(", ")}</span>;
      }
      if (v.every((val) => typeof val?.label === "string")) {
        return <span>{v.map((val) => val.label).join(", ")}</span>;
      }
      if (v.every((val) => typeof val?.value === "string")) {
        return <span>{v.map((val) => val.value).join(", ")}</span>;
      }
    }
    return undefined;
  };

  let Value;
  switch (propertyKey) {
    case "addresses":
      Value = (
        <span>
          {value.map((v, i: number) => {
            const hack = v.value ?? v;
            return (
              <div
                className={styles.AddressesPropertyValues}
                key={`address-${i}`}
              >
                <div>{`${hack.address || hack.label} ${
                  hack.complement ? `(${hack.complement})` : ""
                }`}</div>
                <div>{`${hack.zipCode || ""} ${hack.city || ""} - ${
                  hack.country || ""
                }`}</div>
              </div>
            );
          })}
        </span>
      );
      break;
    // TODO add 'artifacts' or `related.artifacts` to Dto
    case "artifacts":
      Value = (
        <>
          <span>{value}</span>
          <span className={styles.ArtifactIcons_Container}>
            <IconGraphNetwork width={15} height={15} />
            <IconGeoSlim width={12} height={15} />
          </span>
        </>
      );
      break;
    case "sex":
      Value = <span>{ENTITY_GENDER_DETAILS[value].label}</span>;
      break;
    case "nationalities":
      Value = value.map((n, i: number) => (
        <div key={`nat-${i}`} className={commons.Flex}>
          <img src={COUNTRY_DETAILS[n.label]?.icon} alt={value} width="24px" />
          &nbsp;
          <span key={`${n.label}-nat-${i}`}>
            {COUNTRY_DETAILS[n.label]?.label}
          </span>
        </div>
      ));
      break;
    case "location":
      Value = (
        <>
          <img src={COUNTRY_DETAILS[value].icon} alt={value} width="24px" />
          <span key={`loc-${value}`}>{COUNTRY_DETAILS[value].label}</span>
        </>
      );
      break;
    case "birthDate":
    case "deathDate":
      Value = (
        <span>
          <Moment format="DD/MM/YYYY">{new Date(value.timestamp)}</Moment>
        </span>
      );
      break;
    case "avatar":
      Value = <img src={value?.value?.path} alt="Avatar" width={32} />;
      break;
    default:
      Value = createElementFromValue(value);
    /* if (Array.isArray(value)) {
      Value = value.map((v) => v.label || v).join(', ');
    } else {
      Value = <span>{value.label || value}</span>;
    } */
  }

  const toggleCollapse = (e: React.MouseEvent) => {
    // e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setIsOverflowing(
      valueRef.current !== null
        ? //@ts-ignore
          valueRef.current.scrollHeight > valueRef.current.clientHeight
        : false
    );
  }, [valueRef]);

  return (
    <div
      className={cx(
        commons.Flex,
        styles.SearchResult__Body__PropertyLine,
        className
      )}
    >
      <span
        className={cx(
          styles.SearchResult__Body__PropertyLine__PropertyLabel,
          labelClassName
        )}
        onClick={toggleCollapse}
      >
        {label}
      </span>
      <span
        ref={valueRef}
        className={cx(
          commons.Flex,
          styles.SearchResult__Body__PropertyLine__PropertyValue,
          {
            [styles.SearchResult__Body__PropertyLine__PropertyValue_Collapsed]:
              isCollapsed,
            [styles.SearchResult__Body__PropertyLine__PropertyValue_Overflowing]:
              isOverflowing,
          },
          valueClassName
        )}
      >
        {Value}
        <span className={styles.DOTDOTDOT} onClick={toggleCollapse}>
          ...
        </span>
      </span>
    </div>
  );
};
const MemoAdvancedSearchResultPropertyLine = React.memo(
  AdvancedSearchResultPropertyLine
);
export default MemoAdvancedSearchResultPropertyLine;
