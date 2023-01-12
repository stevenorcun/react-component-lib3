import React from "react";
import Moment from "react-moment";
import {
  CountryCodeAlpha2,
  EntityDto,
  HomeAddress,
  PhysicalEntityDto,
} from "../API/DataModels/Database/NovaObject";
import Man from "../assets/images/icons/entityTypes/Man";
import IconFile from "../assets/images/icons/IconFile";
import IconCalendar from "../assets/images/icons/IconCalendar";
import IconJusticeHammer from "../assets/images/icons/IconJusticeHammer";
import IconPersonOutline from "../assets/images/icons/IconPersonOutline";
import IconAttachedFile from "../assets/images/icons/entityTypes/IconAttachedFile";
import IconMail from "../assets/images/icons/IconMail";
import IconInformationNote from "../assets/images/icons/IconInformationNote";
import IconGraphNetwork from "../assets/images/icons/IconGraphNetwork";
import IconWindowsFolder from "../assets/images/icons/IconWindowsFolder";
import IconLegalPerson from "../assets/images/icons/IconLegalPerson";
import IconPhone from "../assets/images/icons/IconPhone";
import IconSmartPhone from "../assets/images/icons/entityTypes/IconSmartPhone";
import IconStickyNote from "../assets/images/icons/entityTypes/IconStickyNote";
import IconCar from "../assets/images/icons/entityTypes/IconCar";
import Woman from "../assets/images/icons/entityTypes/Woman";
import IconHamburgerMenu from "../assets/images/icons/IconHamburgerMenu";
import IconPencilEdit from "../assets/images/icons/IconPencilEdit";
import IconMinutes from "../assets/images/icons/IconMinutes";
import IconAircraft from "../assets/images/icons/entityTypes/events/IconAircraft";
import IconAttack from "../assets/images/icons/entityTypes/events/IconAttack";
import IconAtmRobbery from "../assets/images/icons/entityTypes/events/IconAtmRobbery";
import IconCarCrashed from "../assets/images/icons/entityTypes/IconCarCrashed";
import COUNTRY_DETAILS from "../assets/images/icons/flags";
import IconNationality from "../assets/images/icons/entityProperties/IconNationality";
import IconDeathDate from "../assets/images/icons/entityProperties/IconDeathDate";
import IconAddress from "../assets/images/icons/entityProperties/IconAddress";
import IconGeoSlim from "../assets/images/icons/IconGeoSlim";
import IconIpAddress from "../assets/images/icons/IconIpAddress";
import IconTravel from "../assets/images/icons/IconAircraft";
import IconWork from "../assets/images/icons/entityProperties/IconWork";
import IconReference from "../assets/images/icons/entityProperties/IconReference";

import { EnumValueSelectRenderer } from "../components/Browser/ComplexSearch/Form/PhysicalPerson";
import {
  datetimeStrictnessSelectValues,
  DB_STRICTNESS,
  defaultStrictnessSelectValues,
} from "../constants/strictness-select-values";
import {
  NovaEntityConnexionType,
  NovaEntityGender,
  NovaEntityTag,
  NovaEntityType,
  NovaEntityTypeGroup,
} from "../API/DataModels/Database/NovaEntityEnum";
import { ICON_STORE } from "../assets/images/icons/icon-store";

export interface MappedDetails {
  label: string;
  key?: string;
}

interface SheetTab {
  key: string;
  title: string;
  component: ((entity: EntityDto) => JSX.Element) | undefined;
}

interface EntityTypeMappedDetails extends MappedDetails {
  icon: React.ReactNode;
  color: string;
  typeGroup: NovaEntityTypeGroup;
  geolocable: boolean;
  sheet?: {
    headerComponent?: (entity: EntityDto) => JSX.Element;
    defaultTabs?: SheetTab[];
  };
}

export const ontology_settings: any[] = [];

export const ENTITY_TYPE_GROUP: {
  [key in NovaEntityTypeGroup]: MappedDetails;
} = {
  [NovaEntityTypeGroup.Entities]: {
    key: "entities",
    label: "Objets",
  },
  [NovaEntityTypeGroup.Events]: {
    key: "events",
    label: "Évènements",
  },
  [NovaEntityTypeGroup.Documents]: {
    key: "documents",
    label: "Documents",
  },
  [NovaEntityTypeGroup.MultimediaFiles]: {
    key: "multimediaFiles",
    label: "Fichiers multimédias",
  },
  [NovaEntityTypeGroup.RecentActivities]: {
    key: "recentActivities",
    label: "Activités recentes",
  },
  [NovaEntityTypeGroup.Artefacts]: {
    key: "artefacts",
    label: "Artefacts",
  },
};

export const ENTITY_LINK_TYPE = {
  [NovaEntityConnexionType.InvolvedIn]: {
    label: "Impliqué dans",
  },
  [NovaEntityConnexionType.MarriedTo]: {
    label: "Marié à",
  },
  [NovaEntityConnexionType.LinkedTo]: {
    label: "Lié à",
  },
  [NovaEntityConnexionType.UserOf]: {
    label: "Utilisateur de",
  },
  [NovaEntityConnexionType.HolderOf]: {
    label: "Titulaire de",
  },
};

export const ENTITY_TYPE_DETAILS: {
  [key in NovaEntityType]: EntityTypeMappedDetails;
} = {
  // ENTITIES
  [NovaEntityType.PhysicalPerson]: {
    label: "Personne physique",
    icon: <Man />,
    color: "#F04C8B",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: true,
  },
  [NovaEntityType.LegalPerson]: {
    label: "Personne Morale",
    icon: <IconLegalPerson />,
    color: "#F76588",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: true,
  },
  [NovaEntityType.Case]: {
    label: "Affaire",
    icon: <IconJusticeHammer />,
    color: "#1C9C8D",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.File]: {
    label: "Fichier",
    icon: <IconFile />,
    color: "#AA83FF",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.Warrant]: {
    label: "Mandat judiciaire",
    icon: <IconJusticeHammer />,
    color: "#69C2A4",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.Requisition]: {
    label: "Réquisition",
    icon: <IconWindowsFolder />,
    color: "#3288BB",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.Vehicle]: {
    label: "Véhicule",
    icon: <IconCar />,
    color: "#DA035D",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.VirtualIdentity]: {
    label: "Identité virtuelle",
    icon: <IconPersonOutline />,
    color: "#F3752F",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.Phone]: {
    label: "Téléphone fixe",
    icon: <IconPhone />,
    color: "#993865",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: true,
  },
  [NovaEntityType.MobilePhone]: {
    label: "Téléphone portable",
    icon: <IconSmartPhone />,
    color: "#993865",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.MailAddress]: {
    label: "Addresse Mail",
    icon: <IconMail />,
    color: "#993865",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: false,
  },
  [NovaEntityType.IpAddress]: {
    label: "Adresse Ip",
    icon: <IconIpAddress />,
    color: "#993865",
    typeGroup: NovaEntityTypeGroup.Entities,
    geolocable: true,
  },

  // MULTIMEDIA FILES
  [NovaEntityType.Picture]: {
    label: "Photo",
    icon: <IconIpAddress />,
    color: "#993865",
    typeGroup: NovaEntityTypeGroup.MultimediaFiles,
    geolocable: false,
  },
  [NovaEntityType.Video]: {
    label: "Vidéo",
    icon: <IconIpAddress />,
    color: "#993865",
    typeGroup: NovaEntityTypeGroup.MultimediaFiles,
    geolocable: false,
  },

  // ARTIFACTS
  [NovaEntityType.SharedGraph]: {
    label: "Graph partagé",
    icon: <IconGraphNetwork />,
    color: "#3083F7",
    typeGroup: NovaEntityTypeGroup.Artefacts,
    geolocable: false,
  },
  [NovaEntityType.List]: {
    label: "Listes",
    icon: <IconHamburgerMenu />,
    color: "#3083F7",
    typeGroup: NovaEntityTypeGroup.Artefacts,
    geolocable: false,
  },
  [NovaEntityType.WrittenDocument]: {
    label: "Documents rédacteur",
    icon: <IconPencilEdit />,
    color: "#3083F7",
    typeGroup: NovaEntityTypeGroup.Artefacts,
    geolocable: false,
  },

  // RECORDS
  [NovaEntityType.AttachedFile]: {
    label: "Pièce jointe",
    icon: <IconAttachedFile />,
    color: "#AA83FF",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },
  [NovaEntityType.InternalMail]: {
    label: "Mail interne",
    icon: <IconMail />,
    color: "#993865",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },
  [NovaEntityType.Email]: {
    label: "Mail",
    icon: <IconMail />,
    color: "#a0d742",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },
  [NovaEntityType.Note]: {
    label: "Note de renseignement",
    icon: <IconStickyNote />,
    color: "#4F2473",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },
  [NovaEntityType.Document]: {
    label: "Document de retranscription",
    icon: <IconFile />,
    color: "#843CBA",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },
  [NovaEntityType.Minutes]: {
    label: "Procès verbal",
    icon: <IconMinutes />,
    color: "#843CBA",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },
  [NovaEntityType.InformationNote]: {
    label: "Note d'information",
    icon: <IconMinutes />,
    color: "#843CBA",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },
  [NovaEntityType.PersonalNameRecord]: {
    label: "PNR",
    icon: <IconMinutes />,
    color: "#843CBA",
    typeGroup: NovaEntityTypeGroup.Documents,
    geolocable: false,
  },

  // Events
  [NovaEntityType.AirPlaneTravel]: {
    label: "Vol avion",
    icon: <IconAircraft />,
    color: "#843CBA",
    typeGroup: NovaEntityTypeGroup.Events,
    geolocable: false,
  },
  [NovaEntityType.CarAccident]: {
    label: "Accident voiture",
    icon: <IconCarCrashed />,
    color: "#3083F7",
    typeGroup: NovaEntityTypeGroup.Events,
    geolocable: true,
  },
  [NovaEntityType.Attack]: {
    label: "Attaque",
    icon: <IconAttack />,
    color: "#ee423c",
    typeGroup: NovaEntityTypeGroup.Events,
    geolocable: false,
  },
  [NovaEntityType.AtmRobbery]: {
    label: "Vol DAB",
    icon: <IconAtmRobbery />,
    color: "#2BAD7E",
    typeGroup: NovaEntityTypeGroup.Events,
    geolocable: true,
  },

  // ACTIVITY RECENTE
  [NovaEntityType.InformationNoteActivity]: {
    label: "Note d'information",
    icon: <IconInformationNote />,
    color: "#2BAD7E",
    typeGroup: NovaEntityTypeGroup.RecentActivities,
    geolocable: false,
  },
  [NovaEntityType.MailActivity]: {
    label: "Mail",
    icon: <IconMail />,
    color: "#2BAD7E",
    typeGroup: NovaEntityTypeGroup.RecentActivities,
    geolocable: false,
  },
  [NovaEntityType.PersonalNameRecordActivity]: {
    label: "PNRA",
    icon: <IconTravel />,
    color: "#2BAD7E",
    typeGroup: NovaEntityTypeGroup.RecentActivities,
    geolocable: false,
  },
};

interface EntityGenderMappedDetails extends MappedDetails {
  icon: React.ReactNode;
}

export const ENTITY_GENDER_DETAILS: {
  [key in NovaEntityGender]: EntityGenderMappedDetails;
} = {
  [NovaEntityGender.Male]: {
    label: "Homme",
    icon: <Man />,
  },
  [NovaEntityGender.Female]: {
    label: "Femme",
    icon: <Woman />,
  },
};

interface EntityTagMappedDetails extends MappedDetails {
  color: string;
}

export const ENTITY_TAGS_DETAILS: {
  [key in NovaEntityTag]: EntityTagMappedDetails;
} = {
  [NovaEntityTag.Judiciary]: {
    label: "Judiciaire",
    color: "#E7F3FF",
  },
  [NovaEntityTag.Known]: {
    label: "Connu(e)",
    color: "#E1FFF1",
  },
  [NovaEntityTag.Deceased]: {
    label: "Décédé(e)",
    color: "#FFE2E4",
  },
};

export type NovaDataType = "string" | "number" | "datetime" | "enum" | "object";

/**
 * Association table of an entity's property:
 *  - `label`: Translation (capitalized) in French of the property key
 *  - `isMeta`: Specifies if the attribute is a "meta-attribute",
 *              meaning it is not meant for the user
 *  - `type`: The type is used to display the appropriate fields in the search forms
 *  - (optional) `icon`: Icon representing the property
 *                       (mainly used in Entity's Summary tab)
 *  - (optional) `mappedDetails`: References the association table used by that specific property.
 *                                In the search forms, this means we can display a <select> and/or autocomplete
 */
export interface EntityPropertyMappedDetails extends MappedDetails {
  type: NovaDataType;
  // TODO use in `convertToDto` instead of the list that is there
  isMeta: boolean;
  strictness?: Array<{
    value: DB_STRICTNESS;
    label: string;
  }>;
  icon?: React.ReactNode;
  mappedDetails?: {
    [key in string | number]: MappedDetails;
  };
  customRenderer?: React.ReactNode;
  // For representing properties in lines (histogram, search results, etc...)
  customPropertyRenderer?: (
    value:
      | string
      | number
      | CountryCodeAlpha2
      | NovaEntityGender
      | NovaEntityType
      | NovaEntityTypeGroup
      | NovaEntityTag
  ) => React.ReactNode;
}

export const defaultPropertyRenderer = (value: string) => <span>{value}</span>;

const timestampPropertyRenderer = (value: number) => (
  <Moment format="DD/MM/YYYY">{value}</Moment>
);

const countryIsoPropertyRenderer = (value: CountryCodeAlpha2) => (
  <>
    <img src={COUNTRY_DETAILS[value]?.icon} alt={value} width="24px" />
    &nbsp;
    {COUNTRY_DETAILS[value]?.label}
  </>
);

const genderPropertyRenderer = (value: NovaEntityGender) => (
  <>
    {ENTITY_GENDER_DETAILS[value]?.icon}
    &nbsp;
    {ENTITY_GENDER_DETAILS[value]?.label}
  </>
);

const homeAddressPropertyRender = (value: HomeAddress) => (
  <>
    <div>
      {`${value.address || value.label} ${
        value.complement ? `(${value.complement})` : ""
      }`}
    </div>
    <div>
      {`${value.zipCode || ""} ${value.city || ""} - ${value.country || ""}`}
    </div>
  </>
);

export const ENTITY_PROPERTY_DETAILS: {
  [key in keyof EntityDto &
    keyof PhysicalEntityDto]: EntityPropertyMappedDetails;
} = {
  __properties: {
    label: "Propriétés",
    type: "object",
    isMeta: true,
    strictness: [], // should never be used
  },
  addresses: {
    label: "Adresse du domicile",
    type: "string",
    isMeta: false,
    icon: <IconAddress />,
    strictness: defaultStrictnessSelectValues,
    // @ts-ignore
    customPropertyRenderer: homeAddressPropertyRender,
  },
  // TODO add to Dto ? need confirmation on the model
  artifacts: {
    label: "Artefacts",
    type: "object",
    isMeta: true,
  },
  birthDate: {
    label: "Date de naissance",
    type: "datetime",
    isMeta: false,
    icon: <IconCalendar />,
    strictness: datetimeStrictnessSelectValues,
    customPropertyRenderer: timestampPropertyRenderer,
  },
  deathDate: {
    label: "Date de décès",
    type: "datetime",
    isMeta: false,
    icon: <IconDeathDate />,
    strictness: datetimeStrictnessSelectValues,
    customPropertyRenderer: timestampPropertyRenderer,
  },
  label: {
    label: "Mot-Clef",
    type: "string",
    isMeta: false,
    icon: null,
    strictness: defaultStrictnessSelectValues,
  },
  location: {
    label: "Localisation",
    type: "enum",
    isMeta: false,
    mappedDetails: COUNTRY_DETAILS,
    icon: <IconGeoSlim />,
    // @ts-ignore
    customRenderer: EnumValueSelectRenderer,
    strictness: [
      {
        value: DB_STRICTNESS.ONE_OF,
        label: DB_STRICTNESS.ONE_OF,
      },
    ],
    customPropertyRenderer: countryIsoPropertyRenderer,
  },
  names: {
    label: "Nom de l'individu",
    type: "string",
    isMeta: false,
    icon: <IconPersonOutline />,
    strictness: defaultStrictnessSelectValues,
  },
  alias: {
    label: "Pseudonyme",
    type: "string",
    isMeta: false,
    icon: null,
    strictness: defaultStrictnessSelectValues,
  },
  reference: {
    label: "Références",
    type: "string",
    isMeta: false,
    icon: <IconReference />,
    strictness: defaultStrictnessSelectValues,
  },
  keyWords: {
    label: "Mots-clés",
    type: "string",
    isMeta: false,
    icon: null,
    strictness: defaultStrictnessSelectValues,
  },
  nationalities: {
    label: "Nationalité",
    type: "enum",
    isMeta: false,
    mappedDetails: COUNTRY_DETAILS,
    icon: <IconNationality />,
    // @ts-ignore
    customRenderer: EnumValueSelectRenderer,
    strictness: defaultStrictnessSelectValues,
    customPropertyRenderer: countryIsoPropertyRenderer,
  },
  professions: {
    label: "Profession",
    type: "string", // TODO become enum ?
    isMeta: false,
    icon: <IconWork />,
    strictness: defaultStrictnessSelectValues,
  },
  sex: {
    label: "Sexe",
    type: "enum",
    isMeta: false,
    mappedDetails: ENTITY_GENDER_DETAILS,
    // @ts-ignore
    customRenderer: EnumValueSelectRenderer,
    strictness: [
      {
        value: DB_STRICTNESS.IS,
        label: DB_STRICTNESS.IS,
      },
    ],
    customPropertyRenderer: genderPropertyRenderer,
  },
  socialNumber: {
    label: "Numéro de sécurité sociale",
    type: "string",
    isMeta: false,
    icon: null,
    strictness: defaultStrictnessSelectValues,
  },
  subLabel: {
    label: "Information supplémentaire",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  status: {
    label: "Statut",
    type: "string", // TODO become enum ("en prison", etc...)
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  timestamp: {
    label: "Occurrence",
    type: "datetime",
    isMeta: false,
    icon: null,
    strictness: datetimeStrictnessSelectValues,
    customPropertyRenderer: timestampPropertyRenderer,
  },
  // Case properties
  description: {
    label: "Description",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  employeesInvolved: {
    label: "Équipe",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  targets: {
    label: "Cibles",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  parentGroup: {
    label: "Dossier",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  supervisor: {
    label: "Superviseur",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  priority: {
    label: "Niveau d'importance",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  classification: {
    label: "Classification",
    type: "string",
    isMeta: false,
    strictness: defaultStrictnessSelectValues,
  },
  carColor: {
    label: "Couleur carrosserie",
    type: "string",
    isMeta: false,
    icon: null,
    strictness: defaultStrictnessSelectValues,
  },
  carPlate: {
    label: "Plaque d'immatriculation",
    type: "string",
    isMeta: false,
    icon: null,
    strictness: defaultStrictnessSelectValues,
  },
  // Date de début d'événement
  startsAt: {
    label: "Occurrence",
    type: "datetime",
    isMeta: false,
    strictness: datetimeStrictnessSelectValues,
  },
  // Date de fin d'événement
  // TODO: Decider si optionnel ou égal à départ ?
  //  Quand on veut dire "s'est produit à un instant T, pas une période"
  endsAt: {
    label: "Fin occurrence",
    type: "datetime",
    isMeta: false,
    strictness: datetimeStrictnessSelectValues,
  },
  createdAt: {
    label: "Horodatage",
    type: "datetime",
    isMeta: true,
    icon: <IconCalendar />,
    strictness: datetimeStrictnessSelectValues,
    customPropertyRenderer: timestampPropertyRenderer,
  },
  avatar: {
    label: "Avatar",
    type: "object", // todo? or add "image" to say we must use this.value.path (or just custom renderer) ?
    isMeta: false, // can't search by image yet
    strictness: defaultStrictnessSelectValues,
  },
};

export const ONTOLOGY_BLACKLISTED_PROPS = new Set(["RECORD_ID", "ORIG_FILE"]);

export const ONTOLOGY_TYPES_GROUPS = {
  DEFAULT: "Objets",
  LINK: "Liens",
  OTHER: "Autre",
};

export const ONTOLOGY_TYPES_GROUPS_ICONS = {
  DEFAULT: ICON_STORE.DEFAULT,
  LINK: ICON_STORE.LINK,
};

export const getIdProperty = (entity: any, ontology: any[]): string => {
  const { _DATATYPE: type } = entity;
  const ontType = ontology.find((o) => o.name === type);
  const field = ontType?.properties.find((prop) => prop.type === "ID");
  return field?.name;
};

export const getEntityTypeGroup = (
  entity: any,
  ontology: any[]
): string | undefined => {
  const { _DATATYPE: type } = entity;
  const ontType = ontology.find((o) => o.name === type);
  return ontType?.type || "OTHER";
};

export const getEntityTypeId = (
  entity: any,
  ontology: any[]
): string | undefined => {
  const { _DATATYPE: type } = entity;
  const ontType = ontology.find((o) => o.name === type);
  return ontType?.objectId || 0;
};

export const getEntityTypeLabel = (
  entity: any,
  ontology: any[]
): string | undefined => {
  const type = typeof entity === "string" ? entity : entity._DATATYPE;
  const ontType = ontology.find((o) => o.name === type);
  return ontType?.label || type;
};

export const getEntityTypeColor = (
  entity: any,
  ontology: any[]
): string | undefined => {
  const { _DATATYPE: type } = entity;
  const ontType = ontology.find((o) => o.name === type);
  return ontType?.color;
};

export const getEntityTitleProperty = (
  entity: any,
  ontology: any[]
): string | undefined => entity.TITRE || entity.LABEL;

export const getPropStrIcon = (
  entityType: string,
  propKey: string,
  ontology: any
) => {
  const ontType = ontology.find((o) => o.name === entityType);
  const ontProp = ontType?.properties.find((p) => p.name === propKey);
  const icon = ontProp?.icon;
  const Component = ICON_STORE[icon] || ICON_STORE.PROP_DEFAULT;

  return Component;
};

export const getEntityStrIcon = (entity: any, ontology: any): any => {
  const { _DATATYPE: type } = entity;
  const ontType = ontology.find((o) => o.name === type);
  const ontGroupType = ontType?.type;

  const iconDetail = ontType?.icon;

  let Component;

  if (iconDetail && typeof iconDetail === "object") {
    const propOntology = ontType.properties.find(
      (p) => p.id === iconDetail.keyId
    );
    const propName = propOntology?.name;
    const propValue = entity[propName];
    const icon = iconDetail[propValue];
    Component = ICON_STORE[icon] || ICON_STORE[ontGroupType];
  } else {
    Component = ICON_STORE[iconDetail] || ICON_STORE[ontGroupType];
  }

  return Component;
};

export const getObjectTypeStrIcon = (
  typeId: number,
  ontology: any
): string | undefined => {
  const ontType = ontology.find((o) => o.objectId === typeId);
  const ontGroupType = ontType?.type;

  const iconDetail = ontType?.icon || ontGroupType;

  if (iconDetail && typeof iconDetail === "object") {
    return;
  }
  return iconDetail;
};

export const getEntityPropLabel = (
  entityType: string,
  propKey: string,
  ontology: any[]
): string | undefined => {
  const ontType = ontology.find((o) => o.name === entityType);
  const field = ontType?.properties.find((prop) => prop.name === propKey);

  return field?.label || ENTITY_PROPERTY_DETAILS[propKey]?.label || propKey;
};

export const getEntityPropLabelForExplorer = (
  propKey: string,
  ontologie: any[]
): string | undefined => {
  const ontType = ontologie.find((o) =>
    o.properties.find((prop) => prop.name === propKey)
  );
  const field = ontType?.properties.find((prop) => prop.name === propKey);

  return field?.label || ENTITY_PROPERTY_DETAILS[propKey]?.label || propKey;
};

// par exemple: // un objet LINK (objType)
// a TOUJOURS la propriété/colonne (propType) `LINK_ID_SRC`
// MAIS la clef pour accéder à cette valeur est dynamique (ici, "ID_SOURCE")
export const getOntPropertyByTypeByObjectType = ({
  ont,
  objType,
  propType,
}) => {
  const found = ont
    ?.find(({ type }) => ONTOLOGY_TYPES_GROUPS[type] === objType)
    ?.properties?.find(({ type }) => type === propType);
  if (found) return found;

  console.warn(
    `La propriété ${propType} n'a pas été trouvée dans l'ontologie, pour les objets de type ${objType}`
  );
  return undefined;
};
export const getObjectTypeLabel = (typeId: number, ontology: any[]): string => {
  const ontType = ontology?.find((o) => o.objectId === typeId);
  return ontType?.label || ontType?.name;
};

type LINK_ID_TYPES = "LINK_ID_SRC" | "LINK_ID_DEST";
export const getLinkIdPropKey = (link, ontology, linkType: LINK_ID_TYPES) => {
  const ontType = ontology.find((o) => o.name === link._DATATYPE);
  const prop = ontType?.properties.find((p) => p.type === linkType);
  return prop?.name;
};

export const getGeoPropertyKey = (entity, ont): string => {
  const { _DATATYPE: type } = entity;
  const ontType = ont.find((o) => o.name === type);
  const geoProp = ontType?.properties.find((p) => p.name === "COORDONNEES_GEO");

  return geoProp?.name;
};
