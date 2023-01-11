// TODO localization? also why the f- is this not OK for that rule Oo ?
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum DB_STRICTNESS {
  IS = "Est",
  EXACT = "Est exactement",
  ONE_OF = "Est l'un des éléments suivants",
  RANGE = "Est entre",
}

export const defaultStrictnessSelectValues = [
  {
    value: DB_STRICTNESS.IS,
    label: DB_STRICTNESS.IS,
  },
  {
    value: DB_STRICTNESS.EXACT,
    label: DB_STRICTNESS.EXACT,
  },
  {
    value: DB_STRICTNESS.ONE_OF,
    label: DB_STRICTNESS.ONE_OF,
  },
];

export const datetimeStrictnessSelectValues = [
  {
    value: DB_STRICTNESS.RANGE,
    label: DB_STRICTNESS.RANGE,
  },
];
