import React, { useEffect, useState } from "react";
import cx from "classnames";
import Moment from "react-moment";

import { EntityDto } from "../../../API/DataModels/Database/NovaObject";
import {
  createTabByType,
  selectBrowser,
  setActiveTabSearchForm,
  toggleAllSelection,
} from "../../../store/browser";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { unhandle } from "../../../utils/DOM";
import { selectOntologyConfig } from "../../../store/ontology";

import advancedSearchStyles from "../../../pages/Browser/ComplexSearchLayout/ComplexSearchLayout.scss";
import BrowserSearchResult from "../../../components/Browser/SearchResult/SearchResult";
import GroupedValuesInput from "../../../lib/Form/GroupedValuesInput/GroupedValuesInput";
import Button from "../../../lib/Button/Button";
import ResultFilters from "../../../components/Browser/ComplexSearch/ResultFilters/ResultFilters";
import { SearchTabLayoutProps } from "../../../pages/Browser/SearchTabLayout/SearchTabLayout";
import DateTimePicker from "../../../lib/DateTimePicker/DateTimePicker";
import {
  BROWSER_FORM_MAPPING_BY_TYPE_DETAILS,
  BrowserTabType,
} from "../../../constants/browser-related";
import {
  getEntityTypeId,
  ONTOLOGY_TYPES_GROUPS,
} from "../../../constants/entity-related";

import IconSearch from "../../../assets/images/icons/IconSearch";
import IconCalendar from "../../../assets/images/icons/IconCalendar";
import IconGridDisplayMode from "../../../assets/images/icons/IconGridDisplayMode";
import IconTrash from "../../../assets/images/icons/IconTrash";
import IconBell from "../../../assets/images/icons/IconBell";
import IconFullScreen from "../../../assets/images/icons/IconNewTab";
import IconOpen from "../../../assets/images/icons/IconOpen";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import ModalTypes from "../../../constants/modal";
import { useGlobalModalContext } from "../../../hooks/useGlobalModal";
import styles from "./SimpleSearchLayout.scss";

const SimpleSearchLayout = ({
  tab,
  onResultClick,
  onResultSelect,
  onResultDragStart,
  onSubmit,
}: SearchTabLayoutProps) => {
  const dispatch = useAppDispatch();
  const browserState = useAppSelector(selectBrowser);
  const { ont } = useAppSelector(selectOntologyConfig);
  const { showModal } = useGlobalModalContext();

  const [isGridMode, setIsGridMode] = useState(true);
  const [isCalendarHidden, setIsCalendarHidden] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(
    tab.form.createdAt?.values[0]?.[0] || null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    tab.form.createdAt?.values[0]?.[1] || null
  );

  const handleGridModeClicked = () => setIsGridMode(true);

  const toggleCalendarVisibility = (
    event: React.MouseEvent | MouseEvent | Event
  ) => {
    event.stopPropagation();
    setIsCalendarHidden(!isCalendarHidden);
  };

  const handleValueChange = (values: string[]) =>
    dispatch(
      setActiveTabSearchForm({
        value: {
          ...tab.form.value,
          values,
        },
      })
    );

  const handleDateChange = (dates: [Date] | [Date, Date]) => {
    const timestamps = [dates.map((d) => d.getTime())];
    setStartDate(dates[0]);
    // @ts-ignore
    setEndDate(dates[1]);

    dispatch(
      setActiveTabSearchForm({
        createdAt: {
          ...tab.form.createdAt,
          // @ts-ignore
          values: timestamps,
        },
      })
    );
  };

  const handleFormSubmit = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    onSubmit(
      tab.form,
      BROWSER_FORM_MAPPING_BY_TYPE_DETAILS[BrowserTabType.Simple]
    );
  };

  const clearDates = (event: React.MouseEvent) => {
    event.stopPropagation();
    // @ts-ignore
    handleDateChange([]);
  };

  useEffect(() => {
    if (tab.form.value.values.length && !tab.requestsCount) handleFormSubmit();
  }, []);

  const handleAllSelect = (e: React.BaseSyntheticEvent) => {
    const { checked } = e.target;
    if (checked) {
      const result = browserState.tabs[
        browserState.activeBrowserTabIndex
      ].results.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});
      dispatch(toggleAllSelection(result));
    } else {
      dispatch(toggleAllSelection({}));
    }
  };

  const handleOpenAllSelectDetails = (e: React.MouseEvent) => {
    unhandle(e);
    Object.keys(tab.selectedResults).forEach((id) => {
      dispatch(
        createTabByType({
          value: tab.selectedResults[id].label,
          type: BrowserTabType.EntityDetails,
          activeEntity: tab.selectedResults[id],
          isActive: false,
        })
      );
    });
  };

  const handleAddToListModal = () => {
    const entities = Object.values(tab.selectedResults).map(
      (element) => element
    );
    showModal(ModalTypes.LISTS_ADD_TO_LIST, { entities });
  };

  return (
    <div
      className={cx(
        advancedSearchStyles.MainContainer,
        commons.PrettyScroll,
        styles.MainContainer
      )}
    >
      <div className={styles.ResultFilters__Container}>
        <div
          className={cx(
            commons.Flex,
            commons.FlexAlignItemsCenter,
            styles.ResultFilters__Total
          )}
        >
          <div className={styles.ResultFilters__Total_Label}>
            Tous les résultats
          </div>
          <div className={styles.ResultFilters__Total_Count}>
            {tab.results.length}
          </div>
        </div>
        <hr />
        <div className={styles.ResultFilters__Filters}>
          <ResultFilters filters={tab.resultTypeFilters} />
        </div>
      </div>

      <div className={styles.SearchAndResults__Container}>
        <div className={styles.SearchWidget__Container}>
          <div
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.SearchWidget__Form
            )}
          >
            <IconSearch width={20} height={20} />
            <GroupedValuesInput
              className={cx(
                commons.PrettyScroll,
                styles.SearchWidget__Form_Input
              )}
              values={tab.form.value.values}
              onChange={handleValueChange}
            />
            <div
              className={cx(
                commons.clickable,
                styles.SearchWidget__Form_QueryLanguage
              )}
            >
              Lucene
            </div>
            <div
              className={cx(
                commons.Flex,
                commons.FlexAlignItemsCenter,
                styles.SearchWidget__Form_DatePicker
              )}
              onClick={toggleCalendarVisibility}
            >
              <div className={styles.SearchWidget__Form_DatePicker_Icons}>
                <IconCalendar width={20} height={20} />
                <IconTrash
                  className={cx({
                    // @ts-ignore
                    [commons.Hidden]: !tab.form.createdAt.values.length,
                  })}
                  width={20}
                  height={20}
                  onClick={clearDates}
                />
              </div>
              <div
                className={cx(
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  commons.FlexJustifyContentCenter,
                  styles.SearchWidget__Form_DatePicker_DateInput
                )}
                onClick={toggleCalendarVisibility}
              >
                <div
                  className={
                    styles.SearchWidget__Form_DatePicker_DateInput_Label
                  }
                >
                  Date de début
                </div>
                <div
                  className={
                    styles.SearchWidget__Form_DatePicker_DateInput_Value
                  }
                >
                  {startDate ? (
                    <Moment format="DD/MM/YYYY">{startDate}</Moment>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              <div
                className={cx(
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  commons.clickable,
                  styles.SearchWidget__Form_DatePicker_Separator
                )}
                onClick={toggleCalendarVisibility}
              >
                &#8212;
                <div onClick={unhandle}>
                  <DateTimePicker
                    className={cx(styles.SearchWidget__Form_DateTimePicker, {
                      [commons.Hidden]: isCalendarHidden,
                    })}
                    timePickerClassName={
                      styles.SearchWidget__Form_DateTimePicker_Time
                    }
                    value={[startDate, endDate]}
                    selectRange
                    onChange={handleDateChange}
                    toggleVisibility={toggleCalendarVisibility}
                  />
                </div>
              </div>
              <div
                className={cx(
                  commons.Flex,
                  commons.FlexAlignItemsCenter,
                  commons.FlexJustifyContentCenter,
                  styles.SearchWidget__Form_DatePicker_DateInput
                )}
                onClick={toggleCalendarVisibility}
              >
                <div
                  className={
                    styles.SearchWidget__Form_DatePicker_DateInput_Label
                  }
                >
                  Date de fin
                </div>
                <div
                  className={
                    styles.SearchWidget__Form_DatePicker_DateInput_Value
                  }
                >
                  {endDate ? (
                    <Moment format="DD/MM/YYYY">{endDate}</Moment>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>

            <div
              className={cx(
                commons.Flex,
                commons.FlexAlignItemsCenter,
                styles.SearchWidget__SubmitButton
              )}
            >
              <Button onClick={handleFormSubmit}>
                <IconSearch width={12} height={12} />
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        <div className={cx(commons.Flex, styles.Results__Container)}>
          <div
            className={cx(
              commons.Flex,
              commons.FlexAlignItemsCenter,
              styles.Results__DisplayModeButtons_Container
            )}
          >
            <div className={styles.Results__allSelected}>
              <div className={styles.Results__allSelected__container}>
                <p className={styles.Results__allSelected__title}>
                  Afficher des résultats
                </p>
                <div className={styles.Results__allSelected__checkbox}>
                  <input
                    className={styles.Results__allSelectedInput}
                    type="checkbox"
                    id="allSelected"
                    onChange={handleAllSelect}
                  />
                  <label htmlFor="allSelected">Tout sélectionner</label>
                </div>
              </div>
              <div className={styles.Results__allSelected__buttons}>
                <button
                  className={styles.Results__allSelected__button}
                  title="Notification"
                  type="button"
                >
                  <IconBell />
                </button>
                <button
                  onClick={handleAddToListModal}
                  className={styles.Results__allSelected__button}
                  title="Ouvrir dans liste"
                  type="button"
                >
                  <IconOpen />
                </button>
                <button
                  onClick={handleOpenAllSelectDetails}
                  className={styles.Results__allSelected__button}
                  title="Ouvrir dans onglet"
                  type="button"
                >
                  <IconFullScreen />
                </button>
              </div>
            </div>
            <div className={styles.Results__display}>
              <span>Vue:&nbsp;</span>
              <Button
                className={cx(
                  styles.Results__DisplayModeButton,
                  styles.Results__DisplayModeButton_Grid,
                  { [styles.Selected]: isGridMode }
                )}
                onClick={handleGridModeClicked}
              >
                <IconGridDisplayMode />
              </Button>
              {/* // T623: hotifx -> disable row mode
              <Button
                className={cx(
                  styles.Results__DisplayModeButton,
                  styles.Results__DisplayModeButton_Row,
                  { [styles.Selected]: !isGridMode }
                )}
                onClick={handleRowModeClicked}
              >
                <IconHamburgerMenu />
              </Button>
              */}
            </div>
          </div>

          <div className={cx(commons.Flex, styles.Results__List)}>
            {Object.keys(tab.resultsByTypeGroup).map((group, index) => {
              const isGroupVisible = tab.resultTypeFilters[group]?.checked;
              return (
                isGroupVisible && (
                  <div
                    className={cx(
                      commons.Flex,
                      commons.FlexDirectionColumn,
                      styles.Results__List_Group
                    )}
                    key={index}
                  >
                    <div
                      className={cx(
                        commons.Flex,
                        commons.FlexAlignItemsCenter,
                        styles.Results__List_Group_Label
                      )}
                    >
                      {ONTOLOGY_TYPES_GROUPS[group]}
                      <span>{tab.resultsByTypeGroup[group]?.length || 0}</span>
                    </div>
                    <div
                      className={cx(commons.Flex, styles.Results__List, {
                        [styles.Results__List_GridMode]: isGridMode,
                      })}
                    >
                      {tab.resultsByTypeGroup[group].map(
                        (result: EntityDto, i: number) => {
                          const typeId = getEntityTypeId(result, ont);
                          const isTypeVisible =
                            tab.resultTypeFilters[group][typeId]?.checked;
                          return (
                            (isTypeVisible || undefined) && (
                              <div key={`entity-${i}`}>
                                <BrowserSearchResult
                                  entity={result}
                                  isSelected={!!tab.selectedResults[result.id]}
                                  className={styles.AdvancedSearchResult}
                                  handleSelect={onResultSelect}
                                  handleClick={onResultClick}
                                  handleDragStart={onResultDragStart}
                                />
                              </div>
                            )
                          );
                        }
                      )}
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSearchLayout;
