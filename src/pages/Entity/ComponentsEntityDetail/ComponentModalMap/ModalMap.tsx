/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import cx from "classnames";

import IconBox from "../../../../assets/images/icons/IconBox";
import IconOpenArrow from "../../../../assets/images/icons/IconOpenArrow";
import IconMinus from "../../../../assets/images/icons/IconMinus";
import IconMap from "../../../../assets/images/icons/IconMap";
import IconArrowUp from "../../../../assets/images/icons/IconArrowUp";
import IconHome from "../../../../assets/images/icons/IconAddressBackground";
import IconHobbies from "../../../../assets/images/icons/IconHobbies";
import IconOffice from "../../../../assets/images/icons/IconOffice";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import style from "./modalMap.scss";

const dataEntity = {
  idx: 0,
  name: "John Doe W.junior",
  birthday: "20 Juin 1989",
  deathDate: "20 décembre 2021",
  type: "Personne physique",
  adress: [
    {
      idx: 0,
      title: "addresse du domicile",
      icon: <IconHome />,
      address: "3 rue du grand Bouleau, ",
      complement: "apt 204 B",
      zipCode: "62000 ",
      city: "Boulogne-sur-mer",
      country: "France",
    },
    {
      idx: 1,
      title: "addresse du loisir",
      icon: <IconHobbies />,
      address: "3 rue du grand Bouleau, ",
      complement: "apt 204 B",
      zipCode: "62000 ",
      city: "Boulogne-sur-mer",
      country: "France",
    },
    {
      idx: 2,
      title: "addresse du bureau",
      icon: <IconOffice />,
      address: "3 rue du grand Bouleau, ",
      complement: "apt 204 B",
      zipCode: "62000 ",
      city: "Boulogne-sur-mer",
      country: "France",
    },
  ],
  typeObjects: [
    {
      idx: 0,
      typeName: "Types d'objets",
      list: [
        {
          idx: 0,
          title: "Personne",
          nbr: 4,
          percent: 80,
        },
        {
          idx: 1,
          title: "Lieu",
          nbr: 1,
          percent: 10,
        },
        {
          idx: 2,
          title: "Véhicule",
          nbr: 1,
          percent: 10,
        },
      ],
      totalNbrList: 6,
    },
    {
      idx: 1,
      typeName: "Types d'évènement liés",
      list: [{ title: "Accident", nbr: 1, percent: 100 }],
      totalNbrList: 1,
    },
  ],
  flags: { nationalities: ["fr"], location: "fr" },
};

interface PropsHeader {
  title: string;
  iconName: any;
}

const Header = ({ title, iconName }: PropsHeader) => (
  <div className={style.headerComponent}>
    <div className={style.headerComponent__left}>
      {iconName}
      <p className={style.textTitle}>{title}</p>
    </div>
    <button type="button">
      <IconArrowUp fill="#3083F7" transform="scale(1.2)" />
    </button>
  </div>
);

const ListAddress = () => (
  <div>
    {dataEntity.adress.map((dataAddress) => (
      <div className={style.listAdressComponent} key={dataAddress.idx}>
        {dataAddress.icon}
        <div className={style.listAdressComponent__address}>
          <p className={style.listAdressComponent__address__title}>
            {dataAddress.title}
          </p>
          <p className={style.listAdressComponent__address__paragraph}>
            {dataAddress.address}
            {dataAddress.complement}
          </p>
          <p className={style.listAdressComponent__address__paragraph}>
            {dataAddress.zipCode}
            {dataAddress.city}
          </p>
          <p className={style.listAdressComponent__address__paragraph}>
            {dataAddress.country}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const ModalMap = () => (
  <div className={cx(style.modalMap, commons.PrettyScroll)}>
    <div className={style.header}>
      <div className={style.header__left}>
        <IconBox fill="white" transform="scale(0.9)" />
        <p>Propriété de l'objet avec localisation</p>
      </div>
      <div>
        <button type="button">
          <IconOpenArrow fill="white" />
        </button>
        <button type="button">
          <IconMinus fill="white" />
        </button>
      </div>
    </div>
    <Header iconName={<IconMap fill="#3083F7" />} title="Adresses" />
    <ListAddress />
  </div>
);

export default ModalMap;
