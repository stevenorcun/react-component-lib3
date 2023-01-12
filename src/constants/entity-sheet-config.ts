import { NovaEntityType } from "../API/DataModels/Database/NovaEntityEnum";
import { EntityDto } from "../API/DataModels/Database/NovaObject";
// Components
import CaseHeader from "../components/Sheet/Headers/CaseHeader/CaseHeader";
import EntityHeader from "../components/Sheet/Headers/EntityHeader/EntityHeader";
import TabCaseSummary from "../components/Sheet/Tabs/TabCaseSummary/TabCaseSummary";
import TabEntitySummary from "../components/Sheet/Tabs/TabEntitySummary/TabEntitySummary";
import TabMap from "../components/Sheet/Tabs/TabMap/TabMap";
import TabMultimediaFile from "../components/Sheet/Tabs/TabMultimediaFile/TabMultimediaFile";
import TabProperty from "../components/Sheet/Tabs/TabProperty/TabProperty";
import TabRecentActivity from "../components/Sheet/Tabs/TabRecentActivity/TabRecentActivity";
import TabRelated from "../components/Sheet/Tabs/TabRelated/TabRelated";

interface SheetTab {
  key: string;
  title: string;
  component: ((entity: EntityDto) => JSX.Element) | undefined;
}

export const ENTITY_DEFAULT_HEADER = {
  component: EntityHeader,
};

export const ENTITY_DEFAULT_TABS: SheetTab[] = [
  // @ts-ignore
  { key: "summary", title: "Résumé", component: TabEntitySummary },
  { key: "property", title: "Propriété", component: TabProperty },
  // @ts-ignore
  { key: "connexe", title: "Connexe", component: TabRelated },
  { key: "map", title: "Carte", component: TabMap },
  {
    key: "multimedia",
    title: "Fichiers multimédia",
    // @ts-ignore
    component: TabMultimediaFile,
  },
  // { key: 'history', title: 'Historique', component: undefined },
  {
    key: "activity",
    title: "Activité récente",
    component: TabRecentActivity,
  },
];

export const ENTITY_SHEET_DEFAULT = {
  // ENTITIES
  [NovaEntityType.PhysicalPerson]: {},
  [NovaEntityType.LegalPerson]: {},
  [NovaEntityType.Case]: {
    headerComponent: CaseHeader,
    defaultTabs: [
      { key: "summary", title: "Résumé", component: TabCaseSummary },
      //  { key: 'analyse', title: "Éléments d'analyse", component: undefined },
      { key: "property", title: "Propriétés", component: TabProperty },
      //  { key: 'connexe', title: 'Connexe', component: TabRelated },
      { key: "map", title: "Carte", component: TabMap },
      {
        key: "multimedia",
        title: "Fichiers multimédia",
        component: TabMultimediaFile,
      },
      // { key: 'history', title: 'Historique', component: undefined },
      // {
      //   key: 'activity',
      //   title: 'Activité récente',
      //   component: TabRecentActivity,
      // },
    ],
  },
  [NovaEntityType.File]: {},
  [NovaEntityType.Warrant]: {},
  [NovaEntityType.Requisition]: {},
  [NovaEntityType.Vehicle]: {},
  [NovaEntityType.VirtualIdentity]: {},
  [NovaEntityType.Phone]: {},
  [NovaEntityType.MobilePhone]: {},
  [NovaEntityType.MailAddress]: {},
  [NovaEntityType.IpAddress]: {},

  // MULTIMEDIA FILES
  [NovaEntityType.Picture]: {},
  [NovaEntityType.Video]: {},

  // ARTIFACTS
  [NovaEntityType.SharedGraph]: {},
  [NovaEntityType.List]: {},
  [NovaEntityType.WrittenDocument]: {},

  // RECORDS
  [NovaEntityType.AttachedFile]: {},
  [NovaEntityType.InternalMail]: {},
  [NovaEntityType.Note]: {},
  [NovaEntityType.Document]: {},
  [NovaEntityType.Minutes]: {},
  [NovaEntityType.InformationNote]: {},
  [NovaEntityType.PersonalNameRecord]: {},

  // Events
  [NovaEntityType.AirPlaneTravel]: {},
  [NovaEntityType.CarAccident]: {},
  [NovaEntityType.Attack]: {},
  [NovaEntityType.AtmRobbery]: {},

  // ACTIVITY RECENTE
  [NovaEntityType.InformationNoteActivity]: {},
  [NovaEntityType.MailActivity]: {},
  [NovaEntityType.PersonalNameRecordActivity]: {},
};
