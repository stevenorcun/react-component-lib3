export const TAG_TYPE_COLOR = {
  1: '#EAF3FE',
  2: '#E1FFF1',
  3: '#FFE2E4',
  4: '#FFF8BC',
  5: '#E9E1FF',
  6: '#FFDDBD',
};

export const TAG_TYPE_BORDER_COLOR = {
  1: '#ACCDFC',
  2: '#88E2B8',
  3: '#FBB2C3',
  4: '#EFE0AB',
  5: '#E9E1FF',
  6: '#FFDDBD',
};

export const TAG_TYPE_NAME = {
  1: 'Cloisonnement',
  2: 'Mission',
  3: 'Vecteur',
  4: 'Zone',
  5: 'Timbre',
  6: 'Contexte',
};


export const getTagColor = (tag:string, conf: any[]): string => {
  const foundConf = conf?.find(c => c.id === tag);
  return foundConf?.color || '#113e9f';
}

export const getTagLabel = (tag:string, conf: any[]): string => {
  const foundConf = conf?.find(c => c.id === tag);
  return foundConf?.label || tag;
}