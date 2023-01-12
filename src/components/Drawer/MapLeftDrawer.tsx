/* eslint-disable linebreak-style */
import Drawer from "../../lib/Drawer/Drawer";
import React from "react";
// import HeatmapPanel from '../Map/ControlPanel/HeatmapPanel';
import LayersData from "./Map/LayersData/LayersData";

interface AuxiliariesLeftMapDrawerProps {
  className?: string;
  onToggleMap: React.MouseEventHandler;
  isCollapsed?: boolean;
}

const AuxiliariesLeftMapDrawer = ({
  onToggleMap,
  className,
  isCollapsed = false,
}: AuxiliariesLeftMapDrawerProps) => {
  const MapMenus = [
    // {
    //   key: 'Carte thermique',
    //   component: <HeatmapPanel />,
    // },
    {
      key: "Couches",
      component: <LayersData />,
    },
  ];

  return (
    <Drawer
      className={className}
      isCollapsed={isCollapsed}
      menus={MapMenus}
      onToggle={onToggleMap}
      isResizable={false}
      position="left"
    />
  );
};
export default AuxiliariesLeftMapDrawer;
