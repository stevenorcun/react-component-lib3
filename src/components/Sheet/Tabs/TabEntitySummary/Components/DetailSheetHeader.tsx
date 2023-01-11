import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityDto, RelatedSummary } from '@/API/DataModels/Database/NovaObject';
import { APP_ROUTES } from '@/constants/routes';
import { createEntities } from '@/store/graph';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import IconBars from '@/assets/images/icons/IconBars';
import IconGraph from '@/assets/images/icons/IconGraph';
import IconMap from '@/assets/images/icons/IconMap';
import { useGlobalModalContext } from '@/hooks/useGlobalModal';
import ModalTypes from '@/constants/modal';
import { getEntitiesFromSummaries } from '@/utils/drag-events';
import { addEntities as addEntitiesToMap } from '@/store/map';
import { selectOntologyConfig } from '@/store/ontology';
import { convertToEntityDto2 } from '@/API/DataModels/DTO/entityDto';
import HeaderComponent, { HeaderProps } from './Header/HeaderComponent';

export interface SheetHeaderOptionsSummary {
  label: string;
  icon?: React.ReactNode;
  isDivider?: boolean;
  onClick?: React.MouseEventHandler;
}

interface DetailSheetHeaderProps extends HeaderProps {
  entities: EntityDto[] | RelatedSummary[],
}

const DetailSheetHeader = ({
  icon,
  title,
  subtitle,
  listProperties,
  isVisibleOption,
  handleDrop,
  layout,
  customizable = false,
  entities = [],
}: DetailSheetHeaderProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModal } = useGlobalModalContext();
  const { ont } = useAppSelector(selectOntologyConfig);

  const dispatchAddToGraph = () => {
    if (Array.isArray(entities)) {
      dispatch(createEntities(entities.map((entity) => convertToEntityDto2(entity, ont))));
      navigate(APP_ROUTES.graph.path);
    }
  };

  const addToMap = () => {
    if (Array.isArray(entities)) {
      getEntitiesFromSummaries(entities)
        .then((dtos) => {
          dispatch(addEntitiesToMap(dtos.filter((e) => !!e.geometry)));
          navigate(APP_ROUTES.map.path);
        })
        .catch((err) => console.error('catch', err));
    }
  };

  const displayAddToListModal = () => {
    showModal(ModalTypes.LISTS_ADD_TO_LIST, { entities });
  };

  const OPTIONS_SUMMARY: SheetHeaderOptionsSummary[] = [
    {
      label: 'Ouvrir dans',
      isDivider: true,
    },
    {
      label: 'Liste',
      icon: <IconBars />,
      onClick: displayAddToListModal,
    },
    {
      label: 'Graph',
      icon: <IconGraph />,
      onClick: dispatchAddToGraph,
    },
    {
      label: 'Carte',
      icon: <IconMap />,
      onClick: addToMap,
    },
  ];
  return (
    <HeaderComponent
      icon={icon}
      title={title}
      options={OPTIONS_SUMMARY}
      layout={layout}
      listProperties={listProperties}
      isVisibleOption={isVisibleOption}
      handleDrop={handleDrop}
      customizable={customizable}
    />
  );
};

export default DetailSheetHeader;
