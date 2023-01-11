import React from 'react';
import IconBars from '@/assets/images/icons/IconBars';
import IconGraph from '@/assets/images/icons/IconGraph';
import IconMap from '@/assets/images/icons/IconMap';

interface OptionsSummary {
  label: string;
  icon: React.ReactNode;
  path?: string;
}

const OPTIONS_SUMMARY: OptionsSummary[] = [
  {
    label: 'Liste',
    icon: <IconBars />,
  },
  {
    label: 'Graph',
    icon: <IconGraph />,
  },
  {
    label: 'Carte',
    icon: <IconMap />,
  },
];

export default OPTIONS_SUMMARY;
