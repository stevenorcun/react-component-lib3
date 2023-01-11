import React, { useEffect, useState } from "react";
import cx from "classnames";
import Calendar from "react-calendar";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import formStyles from "@/components/Browser/ComplexSearch/Form/Form.scss";
import IconCalendar from "@/assets/images/icons/IconCalendar";
import { unhandle } from "@/utils/DOM";
import GroupedValuesInput from "@/lib/Form/GroupedValuesInput/GroupedValuesInput";
import styles from "./MultiValuesCalendar.scss";

interface GroupedValuesCalendarProps {
  values: Array<[number, number]>;
  className?: string;
  placeholder?: string;
  isMulti?: boolean;
  onChange: (values: Array<[number, number]>) => void;
}

// [19700102 00:00, 20370101 23:59] car DataWave
export const CALENDAR_MIN_DATE = new Date(1970, 0, 2, 0, 0, 0, 0);
export const CALENDAR_MAX_DATE = new Date(2037, 0, 1, 23, 29, 29, 99);

const GroupedValuesCalendar = ({
  values,
  placeholder = "Sélectionner une date",
  className = "",
  isMulti = true,
  onChange,
}: GroupedValuesCalendarProps) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [calendarValue, setCalendarValue] = useState<
    Date | [Date, Date] | null
  >(null);

  const customInputValuesFormatter = (interval: [number, number]) => {
    // Never, because we always transform dates to be "from 00h00 to 23h59:59",
    // but if we disable hours and seconds, we can just compare the dates (day/month/year)
    // and apply this check
    if (interval[0] === interval[1])
      return (
        <span className={styles.Calendar__Input__Value}>
          {new Date(interval[0]).toLocaleDateString()}
        </span>
      );
    return (
      <span className={styles.Calendar__Input__Value}>
        {interval
          .map((timestamp) => new Date(timestamp).toLocaleDateString())
          .join(" - ")}
      </span>
    );
  };

  const handleInputValuesChange = (values) => onChange(values);

  const toggleCalendar = (e: MouseEvent | React.MouseEvent) => {
    e.stopPropagation();
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleDateChange = (date: [Date, Date]) => {
    const formattedDate: [number, number] = [
      date[0].getTime(),
      date[1].getTime(),
    ];
    if (isMulti) onChange([...values, formattedDate]);
    else onChange([formattedDate]);
    setCalendarValue(null);
    setIsCalendarVisible(false);
  };

  /* Close calendar by clicking anywhere */
  useEffect(() => {
    if (isCalendarVisible) document.addEventListener("click", toggleCalendar);
    return () => {
      document.removeEventListener("click", toggleCalendar);
    };
  }, [isCalendarVisible]);

  return (
    <div className={cx(styles.Container, className)}>
      <div
        className={cx(
          commons.Flex,
          commons.FlexAlignItemsCenter,
          styles.Calendar__InputAndIcon
        )}
        onClick={toggleCalendar}
      >
        <GroupedValuesInput
          className={cx(formStyles.Input, styles.Calendar__Input)}
          placeholder={placeholder}
          values={values}
          type="datetime"
          customValueFormatter={customInputValuesFormatter}
          onChange={handleInputValuesChange}
          onClick={toggleCalendar}
        />
        <IconCalendar
          className={cx(commons.clickable, styles.Input_Date__Icon)}
          onClick={toggleCalendar}
        />
      </div>

      <div className={styles.Input_Date__Calendar_Container} onClick={unhandle}>
        <Calendar
          className={cx({
            [commons.Hidden]: !isCalendarVisible,
          })}
          value={calendarValue}
          selectRange
          minDate={CALENDAR_MIN_DATE}
          maxDate={CALENDAR_MAX_DATE}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default GroupedValuesCalendar;
