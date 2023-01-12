import React, { useState, useEffect } from "react";
import Moment from "react-moment";

import InfoBlock from "../../../../components/InfoBlock/InfoBlock";
import Accordion from "../../../../components/Accordion/Accordion";

import IconCheck from "../../../../assets/images/icons/IconCheck";

import cx from "classnames";
import styles from "./styles.scss";

interface CaseCheckListProps {
  checkList?: any;
}

const defaultProps = {
  checkList: undefined,
};

const CheckListElement = ({
  title,
  description,
  isChecked,
  value,
  onChange,
}: {
  title: string;
  description: string;
  isChecked: boolean;
  value: string;
  onChange: (value: any) => void;
}) => {
  return (
    <div className={cx(styles.messageBox, styles.checkListBox)}>
      <div
        className={cx({
          [styles.actionChecked]: isChecked,
        })}
      >
        <p className={styles.checkListBoxTitle}>{title}</p>
        <p className={styles.messageText}>{description}</p>
      </div>
      <input
        type="checkbox"
        value={value}
        onChange={() => onChange(value)}
        checked={isChecked}
      />
    </div>
  );
};

const CaseBlockCheckList = ({ checkList }: CaseCheckListProps) => {
  const [checkListData, setCheckListData] = useState<any[] | undefined>(
    checkList ? [...checkList.value] : []
  );

  const replaceTitle = (listData: any[] | undefined = checkListData) => {
    if (listData) {
      const wCheckList: any[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const listElement of listData) {
        if (listElement && listElement.content) {
          const obj = JSON.parse(JSON.stringify(listElement));
          const total = listElement.content.length;
          const numberActionChecked = listElement.content.reduce(
            (prev: number, current) => {
              let count = prev;
              count += current.checked ? 1 : 0;
              return count;
            },
            0
          );
          const patternTitle = listElement.titlePattern;
          if (patternTitle) {
            const formattedTitle = patternTitle
              .replace("{n}", numberActionChecked.toString())
              .replace("{count}", total.toString());
            obj.title = formattedTitle;
          }
          wCheckList.push(obj);
        }
      }
      setCheckListData(wCheckList);
    }
  };

  const format = () => {
    if (checkListData) {
      const wCheckList: any[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const data of checkListData) {
        const obj = JSON.parse(JSON.stringify(data));
        if (data && !data.titlePattern) {
          obj.titlePattern = data.title;
        }
        wCheckList.push(obj);
      }
      replaceTitle(wCheckList);
    }
  };

  const toggleAction = (id) => {
    if (checkListData) {
      const wCheckList: any[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const data of checkListData) {
        const obj = JSON.parse(JSON.stringify(data));
        if (obj && obj.content) {
          // eslint-disable-next-line no-restricted-syntax
          for (const key in obj.content) {
            if (obj.content[key].id === id) {
              obj.content[key].checked = !obj.content[key].checked;
            }
          }
        }
        wCheckList.push(obj);
      }
      replaceTitle(wCheckList);
    }
  };

  useEffect(() => {
    format();
  }, [checkList]);

  return (
    <InfoBlock
      icon={<IconCheck />}
      title="Check list"
      subTitle={
        checkList &&
        checkList.createdAt && (
          <>
            Rédigé le{" "}
            <Moment format="DD MMMM YYYY" unix>
              {checkList.createdAt}
            </Moment>
          </>
        )
      }
      classNamePrefix="case-"
      // @ts-ignore
      options
    >
      <>
        {checkListData &&
          checkListData.map((accordion) => (
            <Accordion
              key={accordion.key}
              classNameHead={cx(
                styles.boxContent,
                styles.checkListAccordionTitle
              )}
              title={accordion.title}
            >
              {accordion &&
                accordion.content &&
                accordion.content.map((el) => (
                  <CheckListElement
                    key={el.id}
                    title={el.title}
                    description={el.description}
                    value={el.id}
                    onChange={toggleAction}
                    isChecked={el.checked}
                  />
                ))}
            </Accordion>
          ))}
      </>
    </InfoBlock>
  );
};

CaseBlockCheckList.defaultProps = defaultProps;

export default CaseBlockCheckList;
