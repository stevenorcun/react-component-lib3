import { STROKES_FILLS_COLORS } from '@/constants/graph-themes';
import { GraphEntityProperties } from '@/API/DataModels/Database/NovaObject';
import { Optional } from '@/utils/types';

/**
 * Composant servant à créer une bulle de texte servant d'annotation/commentaire
 * dans le Graph
 *
 * @param label Texte visible du cadre
 * @param width Largeur du cadre
 * @param height Hauteur du cadre
 * @param fill Couleur de fond du cadre
 * @param stroke Couleur des bordures du cadre
 * @param borderWidth Épaisseur des bordures du cadre
 * @param font Style Police
 * @param is bold
 * @param is underline
 */
export interface AnnotationDto extends GraphEntityProperties {
  label: string;
  height: number;
  width: number;
  fill: string; // any valid CSS compliant color value
  stroke: string; // see fill
  borderWidth: number;
  fontSizeInPx: number | string;
  font: string;
  bold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: string;
  textColor: string;
  thikness: string;
}

function AnnotationEntity(
  {
    id = `Annotation-${Math.random()}-${Date.now()}`,
    x,
    y,
    width = 200,
    height = 100,
    label = "Double clic pour éditer puis 'Entrer' pour valider le changement",
    fill = STROKES_FILLS_COLORS[3],
    stroke = STROKES_FILLS_COLORS[13],
    borderWidth = 5,
    fontSizeInPx,
    font,
    bold = false,
    isItalic = false,
    isUnderline = false,
    textAlign,
    textColor = STROKES_FILLS_COLORS[15],
    thikness = '3',
  }: Optional<
  AnnotationDto,
  | 'id'
  | 'width'
  | 'height'
  | 'label'
  | 'fill'
  | 'stroke'
  | 'borderWidth'
  | 'fontSizeInPx'
  | 'font'
  | 'bold'
  | 'isItalic'
  | 'isUnderline'
  >,
) {
  return {
    id,
    x,
    y,
    label,
    width,
    height,
    fill,
    stroke,
    borderWidth,
    fontSizeInPx,
    font,
    bold,
    isItalic,
    isUnderline,
    textAlign,
    textColor,
    thikness,
  };
}

export default AnnotationEntity;
