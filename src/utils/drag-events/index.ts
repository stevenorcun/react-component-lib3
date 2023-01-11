import { EntityDto, RelatedSummary } from '@/API/DataModels/Database/NovaObject';
import ApiFactory from '@/API/controllers/api-factory';
import ObjectsApi from '@/API/controllers/object-api';
import { convertToEntityDto } from '@/API/DataModels/DTO/entityDto';
import { toast } from 'react-toastify';
import DRAG_EVENT_TYPES from '@/constants/drag-events-types';

// eslint-disable-next-line import/prefer-default-export
export const getEntitiesFromSummaries = (
  summaries: EntityDto[] | RelatedSummary[] = [],
) => {
  // foreach -> GET -> Promise.allSettled() -> dispatch createEntities
  const apiClient = ApiFactory.create<ObjectsApi>('ObjectsApi');
  return new Promise((resolve: (entities: EntityDto[]) => void, reject) => {
    Promise.allSettled(
      summaries.map(({ id }) => apiClient.getObject(id)),
    )
      .then((responses) => {
        const rawNewEntities: EntityDto[] = [];
        responses.forEach((response) => {
          if (response.status === 'fulfilled') {
            rawNewEntities.push(
              convertToEntityDto(response.value._source),
            );
          }
        });

        if (rawNewEntities.length !== summaries.length) {
          toast.error(
            `Failed ${
              summaries.length - rawNewEntities.length
            } request(s)`,
          );
        }

        resolve(rawNewEntities);
      })
      .catch((err) => {
        console.error('catch', err);
        reject(err);
      });
  });
};

export const handleEntityOrSummaryDrop = (
  e,
  createEntities: (entities: EntityDto[]) => void,
) => {
  // Allow drop
  e.preventDefault();
  if (!e.dataTransfer) return;

  const rawEntities = e.dataTransfer.getData(
    DRAG_EVENT_TYPES.searchResultEntity,
  );
  if (!rawEntities) return;
  if (rawEntities) {
    try {
      const entities = JSON.parse(rawEntities);
      createEntities(entities);
    } catch (err: unknown) {
      console.error(
        'Error while attempting to drop Nova Entity summaries',
        err,
      );
    }
  }
};
