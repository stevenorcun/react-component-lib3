import { NovaUserRole } from '@/API/DataModels/Database/User';

export interface ExternalAppConfig {
  url: string;
  label?: string;
  isAlwaysVisible?: boolean;
  roles: NovaUserRole[];
}

export const LOCAL_STORAGE_KEYS = {
  markingsConfig: 'markings-config',
  externalAppsConfig: 'external-apps',
  dashboardSettings: 'dashboardSettings',
  summaryProperties: 'propertiesSettings',
  customizedActions: 'customizedActions',
  themeSettings: 'themeSettings',
  shortcuts: 'shortcuts',
  entityDetailsFormSummaryPropertiesLayout:
    'entity-details-form/summary-properties-layout',
  entityDetailsFormSummaryPropertiesVisibilitySettings:
    'entity-details-form/summary-properties-visibility',
};

export const SESSION_STORAGE_KEYS = {
  token: 'token',
  userId: 'userId',
  currentCase: 'currentCase',
};
