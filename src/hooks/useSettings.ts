import { AppSettings } from "../API/controllers/applicative-api";
import { useState } from "react";

export default function useSettings() {
  const defaultSettings: AppSettings = {
    actions: [],
    externalApps: [],
    globalSettings: {
      appTitle: "AltRnativ NOVA",
      mainThemeColor: "#113e9f",
      dateFormat: "dd/MM/yyyy",
    },
    keybinds: [],
    personalizations: [],
  };

  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  return {
    settings,
    setSettings,
  };
}
