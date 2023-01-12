import React, { useEffect, useState } from "react";
import cx from "classnames";
import Calendar, { CalendarProps } from "react-calendar";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import Button from "../../lib/Button/Button";
import IconCalendar from "../../assets/images/icons/IconCalendar";
import Moment from "react-moment";
import IconSortDown from "../../assets/images/icons/IconSortDown";
import NumberInput from "../../lib/Form/NumberInput/NumberInput";
import styles from "./DateTimePicker.scss";

/**
 * A line of number inputs displaying a Date's hours, minutes, seconds and milliseconds (`hh:mm:ss:sss`)
 */
const HhMmSsSss = ({
  value,
  minValue,
  maxValue,
  className,
  onChange,
}: {
  value: Date | null;
  minValue?: Date;
  maxValue?: Date;
  className?: string | string[];
  onChange: (v: Date | null) => void;
}) => {
  const attemptOnChange = (date: Date) => {
    if (minValue && minValue > date) return;
    if (maxValue && maxValue < date) return;

    onChange(date);
  };

  const handleHoursChange = (hh: number) => {
    if (value) {
      let legalValue = hh;
      if (legalValue < 0) legalValue = 23;
      else if (legalValue > 23) legalValue = 0;
      const cloneDate = new Date(value);
      cloneDate.setHours(legalValue);
      attemptOnChange(cloneDate);
    }
  };

  const handleMinutesChange = (mm: number) => {
    if (value) {
      let legalValue = mm;
      if (legalValue < 0) legalValue = 59;
      else if (legalValue > 59) legalValue = 0;
      const cloneDate = new Date(value);
      cloneDate.setMinutes(legalValue);
      attemptOnChange(cloneDate);
    }
  };

  const handleSecondsChange = (ss: number) => {
    if (value) {
      let legalValue = ss;
      if (legalValue < 0) legalValue = 59;
      else if (legalValue > 59) legalValue = 0;
      const cloneDate = new Date(value);
      cloneDate.setSeconds(legalValue);
      attemptOnChange(cloneDate);
    }
  };

  const handleMillisecondsChange = (sss: number) => {
    if (value) {
      let legalValue = sss;
      if (legalValue < 0) legalValue = 999;
      else if (legalValue > 999) legalValue = 0;
      const cloneDate = new Date(value);
      cloneDate.setMilliseconds(legalValue);
      attemptOnChange(cloneDate);
    }
  };

  return (
    <div
      className={cx(
        commons.Flex,
        commons.FlexJustifyContentSpaceAround,
        commons.FlexAlignItemsCenter,
        styles.HhMmSsSss_Container,
        className
      )}
    >
      <NumberInput
        className={styles.HhMmSsSss__TimeInput}
        inputClassname={cx(styles.HhMmSsSss__TimeInput_Input, styles.First)}
        value={value?.getHours()}
        min={0}
        max={23}
        onChange={handleHoursChange}
      />
      <div className={styles.HhMmSsSss__TimeSeparator}>:</div>
      <NumberInput
        className={styles.HhMmSsSss__TimeInput}
        inputClassname={styles.HhMmSsSss__TimeInput_Input}
        value={value?.getMinutes()}
        min={0}
        max={59}
        onChange={handleMinutesChange}
      />
      <div className={styles.HhMmSsSss__TimeSeparator}>:</div>
      <NumberInput
        className={styles.HhMmSsSss__TimeInput}
        inputClassname={styles.HhMmSsSss__TimeInput_Input}
        value={value?.getSeconds()}
        min={0}
        max={59}
        onChange={handleSecondsChange}
      />
      <div className={styles.HhMmSsSss__TimeSeparator}>.</div>
      <NumberInput
        className={styles.HhMmSsSss__TimeInput}
        inputClassname={cx(styles.HhMmSsSss__TimeInput_Input, styles.Last)}
        value={value?.getMilliseconds()}
        min={0}
        max={999}
        onChange={handleMillisecondsChange}
      />
    </div>
  );
};

interface PeriodWidgetRowProps {
  value: number;
  label: string;
  className?: string | string[];
  onClick: (intervalTimestamp: number) => void;
}

const PeriodWidgetRow = ({
  value,
  label,
  className,
  onClick,
}: PeriodWidgetRowProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(value);
  };

  return (
    <div
      className={cx(
        commons.clickable,
        styles.QuickPeriodWidget_Period,
        className
      )}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

const MILLISECONDS_IN_ONE_MONTH = 30.4167 * 24 * 60 * 60 * 1000;
const periodIntervals = [
  {
    label: "Il y a 3 mois",
    value: 3 * MILLISECONDS_IN_ONE_MONTH,
  },
  {
    label: "Il y a 6 mois",
    value: 6 * MILLISECONDS_IN_ONE_MONTH,
  },
  {
    label: "L'année dernière",
    value: 12 * MILLISECONDS_IN_ONE_MONTH,
  },
  {
    label: "Il y a 2 ans",
    value: 2 * 12 * MILLISECONDS_IN_ONE_MONTH,
  },
];

// [19700102 00:00, 20370101 23:59] car DataWave
export const CALENDAR_MIN_DATE = new Date(1970, 0, 2, 0, 0, 0, 0);
export const CALENDAR_MAX_DATE = new Date(2037, 0, 1, 23, 29, 29, 99);

interface DateTimePickerProps
  extends Omit<CalendarProps, "onChange" | "showDoubleView"> {
  calendarClassname?: string | string[];
  onChange: (dates: Date | Date[]) => void;
  toggleVisibility: (event: React.MouseEvent) => void;
}

const DateTimePicker = ({
  className,
  calendarClassname,
  toggleVisibility,
  ...props
}: DateTimePickerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(-1);

  const handleDatesChange = (dates: [Date, Date]) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
    setCurrentPeriodIndex(-1);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    toggleVisibility(e);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onChange(startDate && endDate ? [startDate, endDate] : []);
    toggleVisibility(e);
  };

  const handleStartTimeChange = (v: Date) => {
    if (!startDate) return;
    const startClone = new Date(startDate || Date.now());
    startClone.setHours(v.getHours());
    startClone.setMinutes(v.getMinutes());
    startClone.setSeconds(v.getSeconds());
    startClone.setMilliseconds(v.getMilliseconds());
    setStartDate(startClone);
  };

  const handleEndTimeChange = (v: Date) => {
    if (!endDate) return;
    const endClone = new Date(endDate);
    endClone.setHours(v.getHours());
    endClone.setMinutes(v.getMinutes());
    endClone.setSeconds(v.getSeconds());
    endClone.setMilliseconds(v.getMilliseconds());
    setEndDate(endClone);
  };

  const handlePeriodClicked = (timestampToSubtract: number) => {
    setEndDate(new Date());
    setStartDate(new Date(Date.now() - timestampToSubtract));
    setCurrentPeriodIndex(
      periodIntervals.findIndex(({ value }) => value === timestampToSubtract)
    );
  };

  useEffect(() => {
    if (!props.value) {
      setStartDate(null);
      setEndDate(null);
      return;
    }
    if (props.value[0] instanceof Date) setStartDate(props.value[0]);
    if (props.value[1] instanceof Date) setEndDate(props.value[1]);
  }, [props.value]);

  return (
    <div className={cx(className, commons.Flex, styles.SigmaContainer)}>
      <div className={styles.Sigma_Left}>
        <div
          className={cx(
            commons.Flex,
            commons.FlexDirectionColumn,
            styles.QuickPeriodWidget
          )}
        >
          {periodIntervals.map(({ value, label }, i) => (
            <PeriodWidgetRow
              key={label + value}
              value={value}
              label={label}
              className={cx({
                [styles.Selected]: currentPeriodIndex === i,
              })}
              onClick={handlePeriodClicked}
            />
          ))}
        </div>
      </div>

      <div
        className={cx(
          commons.Flex,
          commons.FlexDirectionColumn,
          styles.Sigma_Right
        )}
      >
        <div className={styles.CalendarContainer}>
          <Calendar
            {...props}
            value={[startDate, endDate]}
            showDoubleView
            minDate={CALENDAR_MIN_DATE}
            maxDate={CALENDAR_MAX_DATE}
            className={cx(styles.SigmaCalendar, calendarClassname)}
            onChange={handleDatesChange}
          />
        </div>

        <div
          className={cx(
            commons.Flex,
            commons.FlexAlignItemsCenter,
            commons.FlexJustifyFlexEnd,
            styles.Footer
          )}
        >
          {startDate !== null && endDate !== null && (
            <div
              className={cx(
                commons.Flex,
                commons.FlexAlignItemsCenter,
                commons.FlexJustifyContentCenter,
                styles.Footer_TimePickers
              )}
            >
              <div className={styles.Footer_TimePickers__Icon}>
                <IconCalendar />
              </div>
              <div className={styles.Footer_TimePickers__StartDate}>
                <Moment format="DD MMM YYYY" locale="FR">
                  {startDate}
                </Moment>
              </div>
              <HhMmSsSss
                className={styles.Footer_TimePickers__StartTime}
                value={startDate}
                maxValue={endDate}
                onChange={handleStartTimeChange}
              />

              <div
                className={cx(
                  commons.Flex,
                  commons.FlexJustifyContentCenter,
                  styles.Footer_TimePickers__Separator
                )}
              >
                <IconSortDown className={commons.RotateMinus90} />
              </div>

              <div className={styles.Footer_TimePickers__EndDate}>
                <Moment format="DD MMM YYYY" locale="FR">
                  {endDate}
                </Moment>
              </div>

              <HhMmSsSss
                className={styles.Footer_TimePickers__StartTime}
                value={endDate}
                minValue={startDate}
                onChange={handleEndTimeChange}
              />
            </div>
          )}

          <div
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Footer_SubmitButtons
            )}
          >
            <Button
              className={cx(
                commons.clickable,
                styles.Footer_SubmitButtons_Cancel
              )}
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              className={cx(
                commons.clickable,
                styles.Footer_SubmitButtons_Confirm
              )}
              onClick={handleConfirm}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
