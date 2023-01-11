import { ENTITY_TYPE_DETAILS, ENTITY_TYPE_GROUP, ONTOLOGY_BLACKLISTED_PROPS } from '@/constants/entity-related';
import { EntityDto, NovaObject, PhysicalEntityDto } from '@/API/DataModels/Database/NovaObject';

export function convertToEntityDto2(data: any, ontology: any, related?: any): any {
  const ontType = ontology.find((o) => o.name === data._DATATYPE)?.properties.map((p) => p.name);
  const propsSet = new Set(ontType || []);

  const keys = Object.keys(data).filter((k) => !ONTOLOGY_BLACKLISTED_PROPS.has(k) && propsSet.has(k) && !!data[k]);

  const m = data._MARKINGS;
  return {
    ...data,
    related: related
      ? { entities: [...related.relations], links: [...related.links] }
      : {
        entities: [],
        links: [],
      },
    _MARKINGS: m ? (Array.isArray(m) ? m : [m]) : [],
    __related: related ? [...related.relations, ...related.links] : [],
    __properties: {
      count: keys.length,
      keys,
      values: keys.map((k: string) => ({
        key: k,
        value: [{ label: data[k] }],
      })),
    },
  };
}

// eslint-disable-next-line import/prefer-default-export
export function convertToEntityDto(
  data: NovaObject['_source'],
): EntityDto {
  // Properties not meant for the average user to see
  const metaProperties: Array<keyof EntityDto | keyof PhysicalEntityDto> = [
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'label',
    'type',
    'tags',
    'files',
    'related',
    'avatar',
    // cases
    'associatedCases',
    'subscribers',
    'messageCount',
    'alerts',
    'comments',
    'sharing',
    'requests',
    'events',
    'lists',
    'checkList',
    'picture',
    'geometry',
    '__fusedEntities',
  ];

  const keys = Object.keys(data);
  const values = keys.reduce((acc: { key: string; value: any }[], key) => {
    // Filter out meta properties
    if (metaProperties.indexOf(key) === -1 && !!data[key]) {
      acc.push({ key, value: data[key] });
    }
    return acc;
  }, []);

  const dto: EntityDto = {
    __properties: {
      count: values.length,
      values,
    },
    label: '',
    type: 0,

    ...data,

    // évite de perdre data.related quand on passe un DTO en props
    // (chose que l'on n'est pas censé faire
    //  mais je n'ai remarqué ce bug que récemment et donc 3/4 de l'App le fait)
    related: (
      data.related
      && typeof data.related === 'object'
      && !Array.isArray(data.related)
    ) ? data.related
      : {
        entities: { count: 0, values: [] },
        documents: { count: 0, values: [] },
        events: { count: 0, values: [] },
        multimediaFiles: { count: 0, values: [] },
      },
  };

  if (data.related && Array.isArray(data.related)) {
    dto.related = {
      ...dto.related,
      ...data.related.reduce((acc, curr) => {
        if (!curr?.value) return acc;
        if (!curr.value?.type && !ENTITY_TYPE_DETAILS[curr.value.type]) {
          return acc;
        }
        const { key } = ENTITY_TYPE_GROUP[ENTITY_TYPE_DETAILS[curr.value.type].typeGroup];

        if (!key) return acc;
        acc[key] = acc[key] ?? { count: 0, values: [] };
        acc[key].values.push(curr);
        acc[key].count += 1;
        return acc;
      }, {}),
    };
  }

  return dto;
}
