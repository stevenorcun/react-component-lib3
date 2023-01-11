import { useState } from 'react';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { BrowserSearchTemplate, BrowserTabType, BrowserTemplateVisibility } from '@/constants/browser-related';

export type BrowserSearchTemplatesByVisibility = {
  [key in BrowserTemplateVisibility]: BrowserSearchTemplate[];
};

// IBrowserSearchTab but only those with an actual form
export type StorableBrowserTabType = Exclude<BrowserTabType, BrowserTabType.EntityDetails>;

export type BrowserSearchTemplateStorage = {
  [browserType in StorableBrowserTabType]: BrowserSearchTemplatesByVisibility;
};

export default function usePreferences(key: string) {
  const default_preferences = {
    [LOCAL_STORAGE_KEYS.themeSettings]: {
      appTitle: 'AltRnativ NOVA',
      colors: {
        mainColor: '#113e9f',
      },
    },
    [LOCAL_STORAGE_KEYS.externalAppsConfig]: [],
    [LOCAL_STORAGE_KEYS.shortcuts]: {
      MENU_DASHBOARD: { group: 'MENU', name: 'Dashboard', sequences: [{ sequence: 'F2', action: 'keydown' }] },
      CLOSE_CASE: {
        group: 'SHEET',
        name: 'Fermer l\'affaire',
        sequences: [{ sequence: 'Control+t', action: 'keydown' }],
      },
      MENU_HELP: { group: 'MENU', name: 'Aide', sequences: [{ sequence: 'F1', action: 'keydown' }] },
      SELECT_ALL: {
        group: 'SELECTION',
        name: 'Tout sélectionner',
        sequences: [{ sequence: 'Control+a', action: 'keydown' }],
      },
      INVERT_SELECTION: {
        group: 'SELECTION',
        name: 'Inverser la sélection',
        sequences: [{ sequence: 'Control+i', action: 'keydown' }],
      },
      MODE_GRID: {
        group: 'GRAPH',
        name: 'Mode grille',
        sequences: [{ sequence: 'F4', action: 'keydown' }],
      },
      // MODE_CIRCLE: {
      //   group: 'GRAPH',
      //   name: 'Mode cercle',
      //   sequences: [{ sequence: 'F8', action: 'keydown' }],
      // },
    },
  };

  const getPreferences = () => {
    try {
      const storedSettings = localStorage.getItem(key);
      return storedSettings
        ? JSON.parse(storedSettings)
        : default_preferences[key] || {};
    } catch (err) {
      toast.error('Préférences invalides, utilisation des valeurs par défaut.');
      return default_preferences[key] || {};
    }
  };

  const [preferences, setPreferences] = useState(getPreferences());

  // must be a string (potentially a stringified JSON)
  const savePreferences = (value?: string) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
    setPreferences(value);
  };

  return {
    setPreferences: savePreferences,
    preferences,
    getDefaults: (key: string): any => default_preferences[key],
  };
}
