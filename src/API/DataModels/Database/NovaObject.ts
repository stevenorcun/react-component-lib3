import { NovaDataTrustLevel } from "../../../components/Modal/components/Graph/ObjectFusion/ModalObjectFusion";
import { NovaEntityGender, NovaEntityType } from "./NovaEntityEnum";

export type NovaObject = {
  _id: string;
  _source: {
    createdAt: number;
    createdBy: string;
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export type NovaObjectRelation = {
  fromId: string;
  toId: string;
  relation: string;
  hypothesis: boolean;
  startDate: Date;
  endDate: Date;
  location: string;
};

export type File = {
  createdBy: string;
  createdAt: string;
  type: "file";
  filename: string;
  contentType: string;
  id: string;
};

export interface CommonEntityBase {
  id: string;
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
}

export interface RelatedSummary extends CommonEntityBase {
  value: {
    // TODO: decide
    //  label must be missing for a summary to be considered "incomplete"
    //  and therefore trigger a GET request
    //  OR
    //  use title (as a "fake props", with the `label`'s value) to make this distinction
    type: NovaEntityType;
    [key: string]: any;
  };
}

export interface EntityAvatar extends CommonEntityBase {
  value: {
    title: string;
    path: string;
  };
}

export interface GpsCoordinates {
  lon: number;
  lat: number;
  alt: number;
}

export interface HomeAddress {
  label?: string;
  complement?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  coordinates?: GpsCoordinates;
  address?: string;
}

export interface HomeAddressSummary extends CommonEntityBase {
  value: HomeAddress;
}

export interface FileSummary extends RelatedSummary {
  value: RelatedSummary["value"] & {
    label: string;
    path: string;
    [key: string]: any;
  };
}

export interface EntitySummary extends RelatedSummary {
  value: RelatedSummary["value"] & {
    label: string;
    sex?: NovaEntityGender;
  };
}

export interface EventSummary extends RelatedSummary {
  value: RelatedSummary["value"] & {
    label: string;
    timestamp?: number; // TODO remove because it's replaced by `startsAt`
    startsAt: number;
  };
}

export interface DocumentSummary extends RelatedSummary {
  value: RelatedSummary["value"] & {
    label: string;
    preview?: string;
  };
}

export interface MultimediaFilesSummary extends RelatedSummary {
  value: RelatedSummary["value"] & {
    label: string;
    preview?: string;
  };
}

export interface EntityPropertyDetails<T> {
  label: T;
  description?: string;
  timestamp?: number;
  geocoding?: string;
  tags?: NovaTag[];
}

export interface GraphElementMandatoryProps {
  id: string;
  x: number;
  y: number;
}

export interface GraphEntityProperties extends GraphElementMandatoryProps {
  fill: string;
  stroke: string;
  width?: number;
  height?: number;
}

// TODO become enum, au lieu de numéros magiques dans type (et le label via mapping)
interface NovaTag {
  label: string;
  type: number;
}

export interface EntityDto extends CommonEntityBase {
  label: string;
  type: NovaEntityType;
  tags?: NovaTag[];
  related: {
    entities: {
      count: number;
      values: EntitySummary[];
    };
    events: {
      count: number;
      values: EventSummary[];
    };
    documents: {
      count: number;
      values: DocumentSummary[];
    };
    multimediaFiles: {
      count: number;
      values: MultimediaFilesSummary[];
    };
  };
  __properties: {
    count: number;
    values: { key: string; value: any }[];
  };

  geometry?: {
    type:
      | "Point"
      | "LineString"
      | "Polygon"
      | "MultiPoint"
      | "MultiLineString"
      | "MultiPolygon";
    coordinates: [number, number];
  };

  trustValue?: NovaDataTrustLevel;

  // IDs on entities fused to create this one (used to un-fuse)
  // Context Menu should display a "un-fuse" option if this property exists
  __fusedEntities?: Array<{
    id: EntityDto["id"];
    label: EntityDto["label"];
  }>;

  [key: string]: any;
}

export interface PhysicalEntityDto extends EntityDto {
  sex?: NovaEntityGender;
  avatar?: EntityAvatar;
  names?: EntityPropertyDetails<string>[];
  birthDate?: EntityPropertyDetails<number>[];
  deathDate?: EntityPropertyDetails<number>[];
  nationalities?: EntityPropertyDetails<CountryCodeAlpha2>[];
  addresses?: HomeAddressSummary[];
  professions?: EntityPropertyDetails<string>[];
  timestamp?: number;

  alias?: EntityPropertyDetails<string>;
  reference?: EntityPropertyDetails<string>;
  keyWords?: EntityPropertyDetails<string>;

  artifacts?: any;

  // Graph specific
  location?: CountryCodeAlpha2;
  subLabel?: string; // was ID
  socialNumber?: string;
  status?: string;
}

export type CountryCodeAlpha2 =
  | "ch"
  | "ci"
  | "ck"
  | "cl"
  | "cm"
  | "cn"
  | "co"
  | "cr"
  | "cu"
  | "cv"
  | "cw"
  | "Cx"
  | "cy"
  | "cz"
  | "de"
  | "dj"
  | "dk"
  | "dm"
  | "dom"
  | "dz"
  | "ec"
  | "ee"
  | "eg"
  | "eh"
  | "er"
  | "esct"
  | "esga"
  | "es"
  | "et"
  | "eu"
  | "fi"
  | "fj"
  | "fk"
  | "fm"
  | "fo"
  | "fr"
  | "ga"
  | "gbeng"
  | "gbnir"
  | "gbsct"
  | "gb"
  | "gbwls"
  | "gd"
  | "ge"
  | "gf"
  | "gg"
  | "gh"
  | "gi"
  | "gl"
  | "gm"
  | "gn"
  | "gp"
  | "gq"
  | "gr"
  | "gs"
  | "gt"
  | "gu"
  | "gw"
  | "gy"
  | "hk"
  | "hm"
  | "hn"
  | "hr"
  | "ht"
  | "hu"
  | "id"
  | "ie"
  | "il"
  | "im"
  | "india"
  | "io"
  | "iq"
  | "ir"
  | "is"
  | "it"
  | "je"
  | "jm"
  | "jo"
  | "jp"
  | "ke"
  | "kg"
  | "kh"
  | "ki"
  | "km"
  | "kn"
  | "kp"
  | "kr"
  | "kw"
  | "ky"
  | "kz"
  | "la"
  | "lb"
  | "lc"
  | "li"
  | "lk"
  | "lr"
  | "ls"
  | "lt"
  | "lu"
  | "lv"
  | "ly"
  | "ma"
  | "mc"
  | "md"
  | "me"
  | "mf"
  | "mg"
  | "mh"
  | "mk"
  | "ml"
  | "mm"
  | "mn"
  | "mo"
  | "mp"
  | "mq"
  | "mr"
  | "ms"
  | "mt"
  | "mu"
  | "mv"
  | "mw"
  | "mx"
  | "my"
  | "mz"
  | "na"
  | "nc"
  | "ne"
  | "nf"
  | "ng"
  | "ni"
  | "nl"
  | "no"
  | "np"
  | "nr"
  | "nu"
  | "nz"
  | "om"
  | "pa"
  | "pe"
  | "pf"
  | "pg"
  | "ph"
  | "pk"
  | "pl"
  | "pm"
  | "pn"
  | "pr"
  | "ps"
  | "pt"
  | "pw"
  | "py"
  | "qa"
  | "re"
  | "ro"
  | "rs"
  | "ru"
  | "rw"
  | "sa"
  | "sb"
  | "sc"
  | "sd"
  | "se"
  | "sg"
  | "sh"
  | "si"
  | "sj"
  | "sk"
  | "sl"
  | "sm"
  | "sn"
  | "so"
  | "sr"
  | "ss"
  | "st"
  | "sv"
  | "sx"
  | "sy"
  | "sz"
  | "tc"
  | "td"
  | "tf"
  | "tg"
  | "th"
  | "tj"
  | "tk"
  | "tl"
  | "tm"
  | "tn"
  | "to"
  | "tr"
  | "tt"
  | "tv"
  | "tw"
  | "tz"
  | "ua"
  | "ug"
  | "um"
  | "un"
  | "us"
  | "uy"
  | "uz"
  | "va"
  | "vc"
  | "ve"
  | "vg"
  | "vi"
  | "vn"
  | "vu"
  | "wf"
  | "ws"
  | "xk"
  | "ye"
  | "yt"
  | "za"
  | "zm"
  | "zw";
