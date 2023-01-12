import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CaseClassification,
  CasePriority,
} from "../../../../API/DataModels/Database/Case";
import { EntityDto } from "../../../../API/DataModels/Database/NovaObject";
import {
  CasePriorityTranslation,
  CaseClassificationTranslation,
} from "../../../../constants/cases";
import Button from "../../../../components/Buttons/Button/Button";
import { useAppDispatch } from "../../../../store/hooks";
import { setCurrentCase } from "../../../../store/case";
import IconStar from "../../../../assets/images/icons/IconStar";
import { APP_ROUTES } from "../../../../constants/routes";
import { SESSION_STORAGE_KEYS } from "../../../../constants/storage-keys";
import styles from "./styles.scss";
import NovaImage from "../../../../components/NovaImage/NovaImage";
import ApiFactory from "../../../../API/controllers/api-factory";
import FavoritesApi from "../../../../API/controllers/favorite-api";
import SvgIconCase from "../../../../assets/images/icons/IconCase";

const CaseHeader = ({
  entity,
  favorite,
}: {
  entity: EntityDto;
  favorite: boolean;
}) => {
  const [caseCurrent, setCaseCurrent] = useState(entity);
  const [hiddenOptionMenu, setHiddenOptionMenu] = useState(true);
  const [isFavorite, setIsFavorite] = useState(favorite);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const openCase = (currentCase) => {
    let caseToOpen = currentCase;
    if (!currentCase) {
      caseToOpen = null;
    }
    const data = {
      id: caseToOpen.id,
      label: caseToOpen.label,
    };
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.currentCase,
      JSON.stringify(data)
    );
    dispatch(setCurrentCase(data));
    navigate(APP_ROUTES.browser.path);
  };

  const toggleOptionMenu = () => {
    setHiddenOptionMenu(!hiddenOptionMenu);
  };

  const toggleFavorite = async () => {
    try {
      const apiClient = ApiFactory.create<FavoritesApi>("FavoritesApi");
      if (isFavorite) {
        await apiClient.removeFavorite(entity.id);
        setIsFavorite(false);
      } else {
        await apiClient.addFavorite(entity.id);
        setIsFavorite(true);
      }
    } catch (err) {
      const baseMsg = "Favoris : erreur";
      const msg = err ? `${baseMsg}\r\n${err}` : baseMsg;
      toast.error(msg);
    }
  };

  useEffect(() => {
    setCaseCurrent(entity);
  }, [entity]);

  return (
    <div className={styles.header}>
      {caseCurrent?.subscribers && (
        <div className={styles.headerCaseFavorite}>
          <IconStar
            fill={isFavorite ? "#3083F7" : "#FFF"}
            stroke={isFavorite ? "#3083F7" : "#EDEDEE"}
            strokeWidth={isFavorite ? 1 : 2}
            onClick={toggleFavorite}
          />
        </div>
      )}
      <div className={styles.headerCaseMainInfos}>
        {caseCurrent.picture ? (
          <NovaImage
            fileId={caseCurrent?.picture?.id}
            fallBackTemplate={<SvgIconCase fill="#113e9f" />}
          />
        ) : (
          <SvgIconCase fill="#113e9f" />
        )}
        <div>
          <h1>{caseCurrent?.label}</h1>
          <div className={styles.mainInfos}>
            <p>N° {caseCurrent?.id}</p>
            {caseCurrent?.parentGroup && (
              <>
                <p>Dossier: {caseCurrent?.parentGroup}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.headerCaseComplementaryInfos}>
        <div>
          <span className={styles.infoTitle}>Date de création</span>
          <span className={styles.infoContent}>
            <Moment format="DD MMMM YYYY" unix>
              {caseCurrent?.createdAt}
            </Moment>
          </span>
        </div>
        {caseCurrent?.classification && (
          <div>
            <span className={styles.infoTitle}>Classification</span>
            <span className={styles.infoContent}>
              {
                CaseClassificationTranslation[
                  CaseClassification[caseCurrent?.classification]
                ]
              }
            </span>
          </div>
        )}
        {caseCurrent?.priority && (
          <div>
            <span className={styles.infoTitle}>Priorité</span>
            <span className={styles.infoContent}>
              {CasePriorityTranslation[CasePriority[caseCurrent?.priority]]}
            </span>
          </div>
        )}
      </div>
      <div className={styles.headerButtons}>
        <Button type="secondary" onClick={toggleOptionMenu}>
          Options
        </Button>
        {!hiddenOptionMenu && (
          <div className={styles.optionMenu}>
            <p className={styles.optionMenuTitle}>Options</p>
            <div className={styles.horizontalDivider} />
            <button type="button">Capitaliser</button>
            <button type="button">Exporter l&apos;affaire</button>
            <button type="button">Clore l&apos;affaire</button>
            <button type="button">Archiver</button>
          </div>
        )}
        <Button onClick={() => openCase(caseCurrent)}>
          Ouvrir l&apos;affaire
        </Button>
      </div>
    </div>
  );
};

export default CaseHeader;
