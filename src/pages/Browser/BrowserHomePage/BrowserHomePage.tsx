import React, { useEffect, useRef, useState } from "react";

import cx from "classnames";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import IconSearch from "../../../assets/images/icons/IconSearch";
import IconSearchAlt from "../../../assets/images/icons/IconSearchAlt";
import Man from "../../../assets/images/icons/entityTypes/Man";
import IconPhone from "../../../assets/images/icons/IconPhone";
import Container from "../../../containers/Container/Container";
import { FormTemplateLoader } from "../../../components/Browser/FormTemplateLoader/FormTemplateLoader";
import {
  BrowserSearchTemplate,
  BrowserTabType,
} from "../../../constants/browser-related";
import {
  BrowserState,
  createTabByType,
  selectBrowser,
} from "../../../store/browser";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { ignore, unhandle } from "../../../utils/DOM";
import styles from "./BrowserHomePage.scss";

interface AdvancedSearchByModelProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  handleClick: React.MouseEventHandler;
}

const AdvancedSearchByModel = ({
  className,
  icon,
  title,
  description,
  buttonText,
  handleClick,
}: AdvancedSearchByModelProps) => (
  <div className={[styles.AdvancedSearchByModel, className].join(" ")}>
    <div className={styles.AdvancedSearchByModel__Icon}>{icon}</div>
    <p className={styles.AdvancedSearchByModel__Title}>{title}</p>
    <p className={styles.AdvancedSearchByModel__Description}>{description}</p>

    <div
      className={cx(commons.clickable, styles.AdvancedSearchByModel__Button)}
      onClick={handleClick}
    >
      {buttonText}
    </div>
  </div>
);

interface BrowserHomePageProps {
  value: string;
  handleSubmit: React.FormEventHandler;
  handleChange: React.FormEventHandler;
  onAdvancedSearchClicked: React.MouseEventHandler;
  onPersonSearchClicked: React.MouseEventHandler;
  onPhoneSearchClicked: React.MouseEventHandler;
}

const BrowserHomePage = ({
  handleSubmit,
  handleChange,
  value,
  onAdvancedSearchClicked,
  onPersonSearchClicked,
  onPhoneSearchClicked,
}: BrowserHomePageProps) => {
  const browserState = useAppSelector<BrowserState>(selectBrowser);
  const dispatch = useAppDispatch();

  // TODO duplicated from <FormTemplateLoaderWithInput /> :(
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleInputFocus = () => setIsFocused(true);

  const toggleVisibility = () => {
    if (isFocused) {
      setIsFocused(false);
      inputRef.current?.blur();
    } else inputRef.current?.focus();
  };

  useEffect(() => {
    if (isFocused) window.addEventListener("click", toggleVisibility);
    return () => {
      window.removeEventListener("click", toggleVisibility);
    };
  }, [isFocused]);

  const handleTemplateLoad = (template: BrowserSearchTemplate) => {
    dispatch(
      createTabByType({
        value: template.title,
        type: BrowserTabType.Simple,
        isActive: true,
        form: template.form,
        loadedTemplate: template,
      })
    );
  };

  return (
    <>
      <svg
        style={{ position: "absolute", left: 0 }}
        width="859"
        height="1050"
        viewBox="0 0 859 1050"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.12"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-353.708 1047.48L-145.614 838.607C-200.171 753.656 -232.125 653.116 -232.125 545.562C-232.125 243.944 11.8193 0 313.438 0C615.056 0 859 243.944 859 545.562C859 847.181 615.056 1091.12 313.438 1091.12C205.104 1091.12 104.565 1058.39 20.3925 1004.61L-188.48 1212.71C-209.523 1233.75 -239.139 1247 -271.094 1247C-335.782 1247 -388 1194.78 -388 1130.09C-388 1098.14 -374.751 1068.52 -353.708 1047.48ZM313.438 935.25C528.545 935.25 703.125 760.67 703.125 545.562C703.125 330.455 528.545 155.875 313.438 155.875C98.33 155.875 -76.2501 330.455 -76.2501 545.562C-76.2501 760.67 98.33 935.25 313.438 935.25Z"
          fill="#CFD8EC"
        />
      </svg>

      <Container className={styles.NewSearchContainer}>
        <h4 className={styles.SearchTitle}>Recherche</h4>
        <div className={styles.SearchBarContainer}>
          <form onSubmit={handleSubmit}>
            <input
              className={styles.SearchInput}
              onChange={handleChange}
              value={value}
              placeholder="Mots-clés"
              onFocus={handleInputFocus}
              onClick={unhandle}
            />
            <IconSearch fill="#0081FF" />
            <div
              onClick={handleSubmit}
              className={cx(styles.SearchBtn, commons.clickable)}
            >
              <IconSearchAlt fill="#fff" />
            </div>
          </form>
        </div>

        <div className={cx(styles.Hack, { [commons.Hidden]: !isFocused })}>
          <FormTemplateLoader
            tabType={BrowserTabType.Simple}
            inputValue={value}
            searchTemplates={browserState.searchTemplates}
            onTemplateLoaded={handleTemplateLoad}
            updateTemplate={ignore}
          />
        </div>

        <div className={styles.AdvancedSearchByModelContainer}>
          <div className={styles.AdvancedSearchByModelContainer__Hint}>
            <p>
              Ou utiliser un <b>modèle de recherche</b>
            </p>
          </div>

          <div className={styles.AdvancedSearchByModelContainer__Content}>
            <AdvancedSearchByModel
              icon={<IconSearch />}
              title="Recherche Avancée"
              description="Ce modèle permet de réaliser des recherches par mots-clés ou propriétés."
              buttonText="Recherche Avancée"
              handleClick={onAdvancedSearchClicked}
            />

            <AdvancedSearchByModel
              icon={<Man />}
              title="Recherche Personne"
              description="Ce modèle permet de réaliser des recherches à partir d'un nom ou d'une adresse."
              buttonText="Rechercher une personne"
              handleClick={onPersonSearchClicked}
            />

            <AdvancedSearchByModel
              icon={<IconPhone />}
              title="Recherche Téléphone"
              description="Ce modèle permet de rechercher des numéros de téléphone complets ou partiels."
              buttonText="Rechercher un téléphone"
              handleClick={onPhoneSearchClicked}
            />
          </div>
        </div>

        <svg
          style={{ position: "absolute", right: 20, bottom: 80 }}
          width="216"
          height="216"
          viewBox="0 0 216 216"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.3"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M210.06 181.44L174.015 145.26C183.465 130.545 189 113.13 189 94.5C189 42.255 146.745 0 94.5 0C42.255 0 0 42.255 0 94.5C0 146.745 42.255 189 94.5 189C113.265 189 130.68 183.33 145.26 174.015L181.44 210.06C185.085 213.705 190.215 216 195.75 216C206.955 216 216 206.955 216 195.75C216 190.215 213.705 185.085 210.06 181.44ZM94.5 162C57.24 162 27 131.76 27 94.5C27 57.24 57.24 27 94.5 27C131.76 27 162 57.24 162 94.5C162 131.76 131.76 162 94.5 162Z"
            fill="#CFD8EC"
          />
        </svg>
      </Container>
    </>
  );
};

export default BrowserHomePage;
