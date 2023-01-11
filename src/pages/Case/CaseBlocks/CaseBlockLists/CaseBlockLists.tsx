import React, { useState, useEffect } from "react";
import Moment from "react-moment";

import InfoBlock from "@/components/InfoBlock/InfoBlock";
import Search from "@/components/Inputs/Search/Search";
import Button from "@/components/Buttons/Button/Button";

import IconBars from "@/assets/images/icons/IconBars";

import styles from "./styles.scss";
import { APP_ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";

interface CaseListsProps {
  lists?: any;
}

const defaultProps = {
  lists: undefined,
};

const ListElement = ({ title, date }: { title: string; date: string }) => {
  return (
    <div className={styles.listContent}>
      <IconBars width="12px" height="12px" fill="#D2D3D4" />
      <div className={styles.listInfos}>
        <span className={styles.listTitle}>{title}</span>
        <span className={styles.listDate}>
          <Moment format="DD/MM/YYYY à HH:mm" unix>
            {date}
          </Moment>
        </span>
      </div>
    </div>
  );
};

const CaseBlockLists = ({ lists }: CaseListsProps) => {
  const [listsData, setListsData] = useState<any[] | undefined>(
    lists ? lists.value : []
  );

  const navigate = useNavigate();

  const goToLists = () => {
    navigate(APP_ROUTES.list.path);
  };

  useEffect(() => {
    if (lists && lists.value) {
      setListsData(lists.value);
    }
  }, [lists]);

  return (
    <InfoBlock
      icon={<IconBars />}
      title="Mes listes liées à l'affaire"
      subTitle={
        lists &&
        lists.createdAt && (
          <>
            Rédigé le{" "}
            <Moment format="DD MMMM YYYY" unix>
              {lists.createdAt}
            </Moment>
          </>
        )
      }
      classNamePrefix="case-"
      // @ts-ignore
      options
    >
      <div>
        <Search iconColor="#94969A" placeholder="Rechercher une liste" />
        {listsData &&
          listsData.map((el) => (
            <ListElement key={el.id} title={el.label} date={el.updatedAt} />
          ))}
        <div className={styles.listButton}>
          <Button onClick={goToLists}>Voir toutes les listes</Button>
        </div>
      </div>
    </InfoBlock>
  );
};

CaseBlockLists.defaultProps = defaultProps;

export default CaseBlockLists;
