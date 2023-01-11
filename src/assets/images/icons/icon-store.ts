import Man from '@/assets/images/icons/entityTypes/Man';
import Woman from '@/assets/images/icons/entityTypes/Woman';
import IconCar from '@/assets/images/icons/entityTypes/IconCar';
import IconPhone from '@/assets/images/icons/IconPhone';
import IconCarCrashed from '@/assets/images/icons/entityTypes/IconCarCrashed';
import IconLegalPerson from '@/assets/images/icons/IconLegalPerson';
import IconTravel from '@/assets/images/icons/IconAircraft';
import IconFile from '@/assets/images/icons/IconFile';
import IconCalendar from '@/assets/images/icons/IconCalendar';
import IconJusticeHammer from '@/assets/images/icons/IconJusticeHammer';
import IconPersonOutline from '@/assets/images/icons/IconPersonOutline';
import IconAttachedFile from '@/assets/images/icons/entityTypes/IconAttachedFile';
import IconMail from '@/assets/images/icons/IconMail';
import IconInformationNote from '@/assets/images/icons/IconInformationNote';
import IconGraphNetwork from '@/assets/images/icons/IconGraphNetwork';
import IconWindowsFolder from '@/assets/images/icons/IconWindowsFolder';
import IconSmartPhone from '@/assets/images/icons/entityTypes/IconSmartPhone';
import IconStickyNote from '@/assets/images/icons/entityTypes/IconStickyNote';
import IconHamburgerMenu from '@/assets/images/icons/IconHamburgerMenu';
import IconPencilEdit from '@/assets/images/icons/IconPencilEdit';
import IconMinutes from '@/assets/images/icons/IconMinutes';
import IconAircraft from '@/assets/images/icons/entityTypes/events/IconAircraft';
import IconAttack from '@/assets/images/icons/entityTypes/events/IconAttack';
import IconAtmRobbery from '@/assets/images/icons/entityTypes/events/IconAtmRobbery';
import IconNationality from '@/assets/images/icons/entityProperties/IconNationality';
import IconDeathDate from '@/assets/images/icons/entityProperties/IconDeathDate';
import IconAddress from '@/assets/images/icons/entityProperties/IconAddress';
import IconGeoSlim from '@/assets/images/icons/IconGeoSlim';
import IconIpAddress from '@/assets/images/icons/IconIpAddress';
import IconWork from '@/assets/images/icons/entityProperties/IconWork';
import IconReference from '@/assets/images/icons/entityProperties/IconReference';

import SvgIconLink from '@/assets/images/icons/IconLink';

import ObjectDefault from '@/assets/images/icons/entityTypes/DEFAULT';
import LinkDefault from '@/assets/images/icons/entityTypes/LINK';
import PropDefault from '@/assets/images/icons/entityProperties/DEFAULT';

const ENTITY_ICONS = {
  Attaque: IconAttack,
  Homme: Man,
  Femme: Woman,
  Voiture: IconCar,
  Téléphone: IconPhone,
  Smartphone: IconSmartPhone,
  Accident: IconCarCrashed,
  'Personne morale': IconLegalPerson,
  Voyage: IconTravel,
  'Vol avion': IconAircraft,
  Affaire: IconJusticeHammer,
  Fichier: IconFile,
  'Mandat judiciaire': IconJusticeHammer,
  Réquisition: IconWindowsFolder,
  Mail: IconMail,
  IP: IconIpAddress,
  Graphe: IconGraphNetwork,
  Liste: IconHamburgerMenu,
  Document: IconPencilEdit,
  'Pièce-jointe': IconAttachedFile,
  Note: IconStickyNote,
  Information: IconInformationNote,
  PNR: IconMinutes,
  'Vol DAB': IconAtmRobbery,
  DEFAULT: ObjectDefault,
};

const LINK_ICONS = {
  Lien: SvgIconLink,
  LINK: LinkDefault,
};

const PROPS_ICONS = {
  Addresse: IconAddress,
  Calendrier: IconCalendar,
  Mort: IconDeathDate,
  'Géo slim': IconGeoSlim,
  Personne: IconPersonOutline,
  Référence: IconReference,
  Nationalité: IconNationality,
  Travail: IconWork,
  PROP_DEFAULT: PropDefault,
};

export const ICON_STORE = {
  ...ENTITY_ICONS, ...LINK_ICONS, ...PROPS_ICONS,
};
