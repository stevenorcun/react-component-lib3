import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import {
  BrowserSearchTemplateStorage,
  StorableBrowserTabType,
} from "@/hooks/usePreferences";
import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import formStyles from "@/lib/Form/DropDownSelect/DropDownSelect.scss";
import { toast } from "react-toastify";
import IconSortDown from "@/assets/images/icons/IconSortDown";
import {
  BrowserSearchTemplate,
  BrowserTabType,
  BrowserTemplateVisibility,
  IBrowserSearchTab,
} from "@/constants/browser-related";
import { unhandle } from "@/utils/DOM";
import IconFavoris from "@/assets/images/icons/IconFavoris";
import ApiFactory from "@/API/controllers/api-factory";
import SearchQueriesApi from "@/API/controllers/search-queries-api";
import styles from "./FormTemplateLoader.scss";

interface SearchTemplateListByStatusProps {
  header: string;
  templates: BrowserSearchTemplate[];
  onItemClick: (template: BrowserSearchTemplate) => void;
  updateTemplate: (template: BrowserSearchTemplate) => void;
}

const SearchTemplateListItem = ({
  template,
  onItemClick,
  onFavouriteChange,
}: {
  template: BrowserSearchTemplate;
  onItemClick: SearchTemplateListByStatusProps["onItemClick"];
  onFavouriteChange: SearchTemplateListByStatusProps["updateTemplate"];
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onItemClick(template);
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavouriteChange({ ...template, favorite: !template.favorite });
  };

  return (
    <div
      className={cx(formStyles.Item, styles.TemplateLabel)}
      data-value={template.title}
      onClick={handleClick}
    >
      <div className={commons.Flex} onClick={toggleFav}>
        <IconFavoris
          width={15}
          className={cx({ [styles.IsFav]: template.favorite })}
          isFilled={template.favorite}
        />
      </div>
      <span className={cx(commons.Flex, commons.FlexAlignItemsCenter)}>
        {template.title}
      </span>
    </div>
  );
};

// TODO not sort in here. Either above or in API's result
const SearchTemplateListByStatus = ({
  header,
  templates,
  onItemClick,
  updateTemplate,
}: SearchTemplateListByStatusProps) => (
  <div
    className={cx(
      commons.Flex,
      commons.FlexDirectionColumn,
      styles.TemplateStatusGroup
    )}
  >
    <span className={styles.StatusHeader}>{header}</span>
    {templates.map((template) => (
      <SearchTemplateListItem
        key={template.title}
        template={template}
        onItemClick={onItemClick}
        onFavouriteChange={updateTemplate}
      />
    ))}
  </div>
);

interface FormTemplateLoaderProps {
  tabType: StorableBrowserTabType;
  templateSearchValue: string;
  placeholder?: string;
  className?: string;
  searchTemplates: BrowserSearchTemplateStorage;
  onTemplateSearchInputValueChange: (value: string) => void;
  onTemplateLoaded: (form: IBrowserSearchTab["loadedTemplate"]) => void;
  onTemplateUpdated: (template: BrowserSearchTemplate) => void;
}

export const FormTemplateLoader = ({
  className,
  tabType = BrowserTabType.Simple,
  searchTemplates,
  inputValue = "",
  onTemplateLoaded,
  updateTemplate,
}: {
  className?: string;
  searchTemplates: BrowserSearchTemplateStorage;
  tabType: StorableBrowserTabType;
  inputValue: string;
  onTemplateLoaded: (template: BrowserSearchTemplate) => void;
  updateTemplate: (template: BrowserSearchTemplate) => void;
}) => {
  const apiClient = ApiFactory.create<SearchQueriesApi>("SearchQueriesApi");

  const [filteredSearchTemplates, setFilteredSearchTemplates] = useState(
    searchTemplates[tabType]
  );

  const loadTemplate = (templateToLoad: BrowserSearchTemplate) => {
    // cause un crash si les champs sont absents ou inconnus
    // TODO null checks dans le formulaire (xhtml) ou init
    if (!Object.keys(templateToLoad.form).length) {
      toast.error("Ce template est invalide (ne possède aucun champs)");
      return;
    }
    onTemplateLoaded(templateToLoad);
  };

  const updateTemplateById = (updatedTemplate: BrowserSearchTemplate) => {
    if (updatedTemplate.id) {
      apiClient
        .updateTemplate(updatedTemplate.id, updatedTemplate)
        .then((template) => {
          updateTemplate(template);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.toString());
        });
    }
  };

  const getTemplatesFromStorage = (search: string) => {
    if (!search) {
      setFilteredSearchTemplates(searchTemplates[tabType]);
      return;
    }

    const titleContains = (template: BrowserSearchTemplate) =>
      template.title.match(new RegExp(inputValue, "i"));

    const sortByFavoriteAsc = (t1, t2) => (t1.favorite <= t2.favorite ? 1 : -1);

    const templatedFilteredByInput = {
      [BrowserTemplateVisibility.Private]: searchTemplates[tabType].personal
        .filter(titleContains)
        .sort(sortByFavoriteAsc),
      [BrowserTemplateVisibility.AdminPreset]: searchTemplates[tabType].preset
        .filter(titleContains)
        .sort(sortByFavoriteAsc),
      [BrowserTemplateVisibility.Shared]: searchTemplates[tabType].shared
        .filter(titleContains)
        .sort(sortByFavoriteAsc),
    };
    setFilteredSearchTemplates(templatedFilteredByInput);
  };

  useEffect(() => {
    getTemplatesFromStorage(inputValue);
  }, [inputValue, searchTemplates[tabType]]);

  return (
    <div
      className={cx(formStyles.Menu, commons.PrettyScroll, styles.DropDownMenu)}
      tabIndex={-1}
    >
      <div
        className={cx(
          commons.Flex,
          commons.FlexDirectionColumn,
          styles.TemplateList,
          className
        )}
      >
        <SearchTemplateListByStatus
          header="Mes requêtes"
          templates={filteredSearchTemplates[BrowserTemplateVisibility.Private]}
          onItemClick={loadTemplate}
          updateTemplate={updateTemplateById}
        />
        <SearchTemplateListByStatus
          header="Requêtes métier"
          templates={
            filteredSearchTemplates[BrowserTemplateVisibility.AdminPreset]
          }
          onItemClick={loadTemplate}
          updateTemplate={updateTemplateById}
        />
        <SearchTemplateListByStatus
          header="Requêtes partagées"
          templates={filteredSearchTemplates[BrowserTemplateVisibility.Shared]}
          onItemClick={loadTemplate}
          updateTemplate={updateTemplateById}
        />
      </div>
    </div>
  );
};

const FormTemplateLoaderWithInput = ({
  placeholder = "Choisir une requête existante",
  className,
  tabType,
  templateSearchValue,
  searchTemplates,
  onTemplateSearchInputValueChange,
  onTemplateLoaded,
  onTemplateUpdated,
}: FormTemplateLoaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleInputFocus = () => setIsFocused(true);

  const toggleVisibility = () => {
    if (isFocused) {
      setIsFocused(false);
      inputRef.current?.blur();
    } else inputRef.current?.focus();
  };

  if (!tabType) {
    return null;
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    onTemplateSearchInputValueChange(e.currentTarget.value);
  };

  const handleTemplateLoaded = (template: BrowserSearchTemplate) => {
    onTemplateLoaded(template);
    toggleVisibility();
  };

  useEffect(() => {
    if (isFocused) window.addEventListener("click", toggleVisibility);
    return () => {
      window.removeEventListener("click", toggleVisibility);
    };
  }, [isFocused]);

  return (
    <>
      <div
        className={cx(
          formStyles.DropDown,
          formStyles.DropDownSelect,
          styles.DropDown,
          { [formStyles.Active]: isFocused },
          className
        )}
        onClick={toggleVisibility}
      >
        <input
          ref={inputRef}
          className={cx(formStyles.Default, styles.SearchInput)}
          placeholder={placeholder}
          value={templateSearchValue}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onClick={unhandle}
        />
        <div className={styles.SearchInput__IconContainer}>
          <IconSortDown width={9} height={5} />
        </div>
        <FormTemplateLoader
          className={cx({
            [commons.Hidden]: !isFocused,
          })}
          inputValue={templateSearchValue}
          tabType={tabType}
          onTemplateLoaded={handleTemplateLoaded}
          searchTemplates={searchTemplates}
          updateTemplate={onTemplateUpdated}
        />
      </div>
    </>
  );
};

export default FormTemplateLoaderWithInput;
