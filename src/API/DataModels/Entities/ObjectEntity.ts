import { GraphEntityProperties } from "@/API/DataModels/Database/NovaObject";

export interface ObjectDto extends GraphEntityProperties {
  fill: string;
  textColor: string;
  icon: string;
  iconColor?: string;
  strokeLabel?: string;
  textLabelColor?: string;
}

function ObjectEntity({
  id = `Object-${Math.random()}-${Date.now()}`,
  fill = "red",
  textColor = "blue",
}) {
  return {
    id,
    fill,
    textColor,
  };
}

export default ObjectEntity;
