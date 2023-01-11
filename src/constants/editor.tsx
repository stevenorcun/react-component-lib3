import React from 'react';
import { STROKES_FILLS_COLORS } from '@/constants/graph-themes';
import IconToolBold from '@/assets/images/icons/IconToolBold';
import IconToolItalic from '@/assets/images/icons/IconToolItalic';
import IconToolUnderline from '@/assets/images/icons/IconToolUnderline';

export const DEFAULT_FONT_SIZE = '16px';

export const USER_COLORS = [
  '#7B61FF',
  '#D7F2D6',
  '#FDD8E1',
  '#3083F7',
  '#F53E6A',
];

export const FONT_STYLES = [
  {
    label: 'icon-bold', style: 'BOLD', icon: <IconToolBold />, tooltip: 'Gras',
  },
  {
    label: 'icon-italic', style: 'ITALIC', icon: <IconToolItalic />, tooltip: 'Italique',
  },
  {
    label: 'icon-underline', style: 'UNDERLINE', icon: <IconToolUnderline />, tooltip: 'Souligné',
  },
];

export const BLOCK_TYPES = [
  { value: 'unstyled', label: 'Défaut' },
  { value: 'paragraph', label: 'Paragraphe' },
  { value: 'header-one', label: 'Titre' },
  { value: 'header-two', label: 'Titre 2' },
  { value: 'header-three', label: 'Titre 3' },
  { value: 'header-four', label: 'Titre 4' },
  { value: 'header-five', label: 'Titre 5' },
  { value: 'header-six', label: 'Titre 6' },
  { value: 'blockquote', label: 'Citation' },
  { value: 'code-block', label: 'Code' },
];

export const zoomOptions = [
  { value: 1.5, label: '150%' },
  { value: 1.4, label: '140%' },
  { value: 1.3, label: '130%' },
  { value: 1.2, label: '120%' },
  { value: 1.1, label: '110%' },
  { value: 1, label: '100%' },
  { value: 0.9, label: '90%' },
  { value: 0.8, label: '80%' },
  { value: 0.7, label: '70%' },
  { value: 0.6, label: '60%' },
  { value: 0.5, label: '50%' },
  { value: 0.4, label: '40%' },
  { value: 0.3, label: '30%' },
  { value: 0.2, label: '20%' },
  { value: 0.1, label: '10%' },
];

export const fontSizeOptions: any[] = [];
for (let i = 9; i <= 26; i++) {
  fontSizeOptions.push({ value: i, label: i });
}

export const styleMap = {
  BOLD: {
    fontWeight: 'bold',
  },
  ITALIC: {
    fontStyle: 'italic',
  },
  UNDERLINE: {
    textDecoration: 'underline',
  },
  'FONT-COLOR': {
    color: 'black',
  },
  'FONT-SIZE': {
    fontSize: DEFAULT_FONT_SIZE,
  },
  'HIGHLIGHT-COLOR': {
    backgroundColor: 'transparent',
  },
};
fontSizeOptions.forEach((option) => {
  styleMap[`FONT-SIZE-${option.value}`] = {
    fontSize: `${option.value}px`,
  };
});
STROKES_FILLS_COLORS.forEach((color) => {
  styleMap[`FONT-COLOR-${color}`] = {
    color,
  };
  styleMap[`HIGHLIGHT-COLOR-${color}`] = {
    backgroundColor: color,
  };
});
USER_COLORS.forEach((color) => {
  styleMap[`HIGHLIGHT-COLOR-${color}`] = {
    backgroundColor: color,
  };
});

// Options for tool menu
export interface MenuOptions {
  key?: string;
  onClick: any;
  label: string;
  icon?: React.ReactNode;
  options?: MenuOptions[][];
}

export const getFileOptions = (props?: any): MenuOptions[][] => [
  [
    {
      label: 'Nouveau',
      onClick: undefined,
      options: [
        [
          {
            label: 'Document',
            onClick: props?.new,
          },
          {
            label: "À partir d'un modèle",
            onClick: props?.importJson,
          },
        ],
      ],
    },
    {
      label: 'Ouvrir',
      onClick: props?.open,
    },
    {
      label: 'Créer une copie',
      onClick: props?.copy,
    },
  ],
  [
    {
      label: 'Enregistrer',
      onClick: props?.save,
    },
  ],
  [
    {
      label: 'Exporter',
      onClick: undefined,
      options: [
        [
          {
            label: 'En HTML',
            onClick: props?.exportHtml,
          },
          {
            label: 'En JSON',
            onClick: props?.exportJson,
          },
        ],
      ],
    },
    {
      label: 'Partager',
      onClick: props?.share,
    },
    {
      label: 'Historique des versions',
      onClick: undefined,
      options: [
        [
          {
            label: 'Nommer la version actuelle',
            onClick: undefined,
          },
          {
            label: "Afficher l'historique des versions",
            onClick: undefined,
          },
        ],
      ],
    },
  ],
  [
    {
      label: 'Renommer',
      onClick: props?.rename,
    },
    {
      label: 'Déplacer',
      onClick: props?.move,
    },
  ],
  [
    {
      label: 'Détails du document',
      onClick: props?.details,
    },
    {
      label: 'Langue',
      onClick: undefined,
      options: [
        [
          {
            label: 'Français',
            onClick: undefined,
          },
        ],
      ],
    },
    {
      label: 'Configuration de la page',
      onClick: props?.pageConfig,
    },
    {
      label: 'Aperçu avant impression',
      onClick: props?.display,
    },
    {
      label: 'Imprimer',
      onClick: props?.print,
    },
  ],
];

export const getEditOptions = (props?: any): MenuOptions[][] => [
  [
    {
      label: 'Annuler',
      onClick: props?.undo,
    },
    {
      label: 'Rétablir',
      onClick: props?.redo,
    },
  ],
  [
    {
      label: 'Couper',
      onClick: props?.cut,
    },
    {
      label: 'Copier',
      onClick: props?.copy,
    },
    {
      label: 'Coller',
      onClick: props?.paste,
    },
    {
      label: 'Coller sans la mise en forme',
      onClick: props?.pasteNoStyle,
    },
    {
      label: 'Supprimer',
      onClick: props?.delete,
    },
    {
      label: 'Tout sélectionner',
      onClick: props?.selectAll,
    },
    {
      label: 'Rechercher et remplacer',
      onClick: props?.findAndReplace,
    },
  ],
];

export const getDisplayOptions = (props?: any): MenuOptions[][] => [
  [
    {
      label: 'Afficher les actions des intervenants',
      onClick: props?.displayActions,
    },
    {
      label: 'Afficher le plan du document',
      onClick: props?.displayPlan,
    },
    {
      label: 'Masquer la barre latérale',
      onClick: props?.hideDrawer,
    },
  ],
];

export const getInsertOptions = (props?: any): MenuOptions[][] => [
  [
    {
      label: "Carte de l'enquête",
      onClick: undefined,
    },
    {
      label: "Graphe de l'enquête",
      onClick: undefined,
    },
    {
      label: "Documents de l'enquête",
      onClick: undefined,
    },
    {
      label: "Objets de l'enquête",
      onClick: undefined,
    },
    {
      label: "Propriétés et liens de l'enquête",
      onClick: undefined,
    },
    {
      label: "Autres éléments de l'enquête",
      onClick: undefined,
    },
  ],
  [
    {
      label: "Éléments d'une autre enquête",
      onClick: undefined,
    },
  ],
  [
    {
      label: 'Image',
      onClick: props?.addImage,
    },
    {
      label: 'Tableau',
      onClick: undefined,
    },
    {
      label: 'Ligne horizontale',
      onClick: undefined,
    },
    {
      label: 'Note de bas de page',
      onClick: undefined,
    },
  ],
  [
    {
      label: 'Caractères spéciaux',
      onClick: undefined,
    },
  ],
  [
    {
      label: 'En-têtes et pieds de page',
      onClick: undefined,
    },
    {
      label: 'Numéros de page',
      onClick: undefined,
    },
    {
      label: 'Saut',
      onClick: undefined,
    },
  ],
  [
    {
      label: 'Commentaire',
      onClick: undefined,
    },
    {
      label: 'Table des matières',
      onClick: undefined,
    },
  ],
];

export const getFormatOptions = (props?: any): MenuOptions[][] => [
  [
    {
      label: 'Texte',
      onClick: undefined,
      options: [
        [
          {
            label: 'Gras',
            onClick: props?.bold,
          },
          {
            label: 'Italique',
            onClick: props?.italic,
          },
          {
            label: 'Souligné',
            onClick: props?.underline,
          },
        ],
      ],
    },
    {
      label: 'Style de paragraphe',
      onClick: undefined,
    },
    {
      label: 'Aligner et mettre en retrait',
      onClick: undefined,
    },
    {
      label: 'Colonnes',
      onClick: undefined,
    },
    {
      label: 'Puces et numéros',
      onClick: undefined,
    },
  ],
  [
    {
      label: 'En-têtes et pieds de page',
      onClick: undefined,
    },
    {
      label: 'Numéros de page',
      onClick: undefined,
    },
  ],
  [
    {
      label: 'Tableau',
      onClick: undefined,
    },
    {
      label: 'Élément importé',
      onClick: undefined,
    },
  ],
  [
    {
      label: 'Supprimer la mise en forme',
      onClick: props?.removeStyle,
    },
  ],
];

export const getToolsOptions = (props?: any): MenuOptions[][] => [
  [
    {
      label: 'Grammaire et orthographe',
      onClick: undefined,
    },
    {
      label: 'Nombre de mots',
      onClick: undefined,
    },
    {
      label: 'Objets associés',
      onClick: undefined,
    },
    {
      label: 'Éléments importés',
      onClick: undefined,
    },
    {
      label: 'Dictionnaire',
      onClick: undefined,
    },
  ],
  [
    {
      label: 'Traduire le document',
      onClick: undefined,
    },
  ],
];

export const getHelpOptions = (props?: any): MenuOptions[][] => [
  [
    {
      label: 'Support de formation',
      onClick: undefined,
    },
    {
      label: 'Objets associés',
      onClick: undefined,
    },
    {
      label: 'Éléments importés',
      onClick: undefined,
    },
    {
      label: 'Raccourcis clavier',
      onClick: undefined,
    },
  ],
];
