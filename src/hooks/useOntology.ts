import { OntologySettings } from "../API/controllers/ontology-settings-api";
import { useState } from "react";

export default function useOntology() {
  const [ontology, setOntology] = useState<OntologySettings[]>([]);

  return {
    ontology,
    setOntology,
  };
}
