/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import cx from "classnames";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { useGlobalModalContext } from "../../../../hooks/useGlobalModal";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  createCase,
  selectCase,
  setListSupervisor,
} from "../../../../store/case";
import ApiFactory from "../../../../API/controllers/api-factory";
import UsersApi from "../../../../API/controllers/users-api";

import Modal from "../../../../components/Modal/Modal";
import Button from "../../../../components/Buttons/Button/Button";
import Input from "../../../../components/Inputs/General/General";
import InputGroupedValue from "../../../../components/Inputs/GroupedValues/GroupedValues";

import IconCase from "../../../../assets/images/icons/IconCase";
import IconArrow from "../../../../assets/images/icons/IconArrowBottomFull";

import styles from "./createCase.scss";
import { NovaEntityType } from "../../../../API/DataModels/Database/NovaEntityEnum";
import { CaseStatus } from "../../../../API/DataModels/Database/Case";
import CasesApi from "../../../../API/controllers/cases-api";

interface ValuesInputsProps {
  [key: string]: {
    label: string;
    isArrow: boolean;
    value: string | { id: string; label: string } | Array<string>;
    lists?: {
      isOpen: boolean;
      value:
        | Array<string>
        | Array<{
            id: string;
            label: string;
          }>;
    };
    placeholder: string;
    readOnly?: boolean;
  };
}

const CreateCase = () => {
  const { hideModal } = useGlobalModalContext();
  const dispatch = useAppDispatch();
  const caseState = useAppSelector(selectCase);
  const [valuesInputs, setValuesInputs] = useState<ValuesInputsProps>({
    parentGroup: {
      label: "Nom du dossier",
      isArrow: true,
      value: "",
      readOnly: false,
      lists: {
        isOpen: false,
        value: ["Sherlock Holmes", "Banque Desremont"],
      },
      placeholder: "Dossier",
    },
    nameCase: {
      label: "Nom de l affaire",
      isArrow: false,
      value: "",
      placeholder: "Affaire",
    },
    supervisorName: {
      label: "Responsable de l affaire",
      isArrow: true,
      value: "",
      readOnly: true,
      lists: {
        isOpen: false,
        value: caseState.listSupervisor.map((element) => element.name),
      },
      placeholder: "Jean-René CALOT",
    },
    service: {
      label: "Service",
      isArrow: false,
      placeholder: "Service",
      value: "",
      readOnly: true,
    },
    targetName: {
      label: "Cible",
      isArrow: false,
      value: "",
      placeholder: "Cible",
    },
    associatedCasesNames: {
      label: "Affaire associés",
      isArrow: true,
      value: [],
      readOnly: true,
      lists: {
        isOpen: false,
        value: caseState.listCases.map((element) => ({
          id: element.id,
          label: element.label,
        })),
      },
      placeholder: "Aucune",
    },
  });

  const [requiredFields, setRequiredField] = useState({});

  const handleRequiredField = () => {
    const copyData = JSON.parse(JSON.stringify(valuesInputs));
    delete copyData.targetName;
    delete copyData.associatedCasesNames;
    delete copyData.parentGroup;
    setRequiredField(copyData);
  };

  const handleSubmitCreateCase = async () => {
    const copyData = JSON.parse(JSON.stringify(valuesInputs));
    delete copyData.targetName;
    delete copyData.associatedCasesNames;
    delete copyData.parentGroup;
    const filter = Object.values(copyData).find(
      (element: any) => element.value === ""
    );
    if (filter) {
      toast.error("Veuillez remplir les champs obligatoires");
    } else {
      const findAssociatedCasesNames: Array<{ id: string; label: string }> = [];
      if (Array.isArray(valuesInputs.associatedCasesNames.value)) {
        valuesInputs.associatedCasesNames.value.forEach((element) => {
          const result: { id: string; label: string } =
            valuesInputs.associatedCasesNames?.lists?.value?.find(
              (el) => el.label === element
            );
          if (result) {
            findAssociatedCasesNames.push(result);
          }
        });
      }
      const findSupervisorName = caseState.listSupervisor.find(
        (element) => element.name === valuesInputs.supervisorName.value
      );

      try {
        const newCase = {
          type: NovaEntityType.Case,
          status: CaseStatus.Initiated.toString(),
          parentGroup: valuesInputs.parentGroup.value,
          supervisor: {
            ...findSupervisorName,
          },
          label: valuesInputs.nameCase.value,
          associatedCases: findAssociatedCasesNames,
          associatedCasesNames: valuesInputs.associatedCasesNames.value,
          targets: valuesInputs.targetName.value
            .split(",")
            .map((value: string) => {
              return {
                id: uuidv4(),
                label: value.trim(),
                type: NovaEntityType.PhysicalPerson,
                tags: [],
                avatar: {
                  id: uuidv4(),
                  value: {
                    title: value,
                    path: "missing_image.png",
                  },
                },
              };
            }),
        };
        const apiClient = ApiFactory.create<CasesApi>("CasesApi");
        const dbCase = await apiClient.createCase(newCase);

        dispatch(createCase(dbCase));

        toast.success("Votre affaire a bien été créée");
      } catch (err) {
        const baseMsg = "Erreur de création d'affaire";
        const msg = err ? `${baseMsg}\r\n${err}` : baseMsg;
        toast.error(msg);
      }

      hideModal();
    }
  };

  const handleOpenCategory = (category) => {
    setValuesInputs({
      ...valuesInputs,
      [category]: {
        ...valuesInputs[category],
        lists: {
          ...valuesInputs[category].lists,
          isOpen: !valuesInputs[category].lists?.isOpen,
        },
      },
    });
  };

  const init = async () => {
    const apiClient = ApiFactory.create<UsersApi>("UsersApi");
    const res = await apiClient.allUsers();
    return res;
  };

  useEffect(() => {
    handleRequiredField();
    if (caseState.listSupervisor.length === 0) {
      init()
        .then((res) => {
          dispatch(setListSupervisor(res));
        })
        .catch((err) => console.error("err", err));
    }
  }, []);

  useEffect(() => {
    setValuesInputs({
      ...valuesInputs,
      supervisorName: {
        ...valuesInputs.supervisorName,
        lists: {
          ...valuesInputs.supervisorName.lists,
          value: caseState.listSupervisor.map((element) => element.name),
        },
      },
    });
  }, [caseState.listSupervisor]);

  interface TestProps {
    id: string;
    label: string;
  }

  const List = ({
    selectElement,
    category,
  }: {
    selectElement: (value: string, category: string) => void;
    category: string;
  }) => (
    <div className={styles.lists}>
      {valuesInputs[category].lists?.value.map(
        (element: TestProps | string, index: number) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <p
            key={index}
            className={styles.element}
            onClick={() => selectElement(element, category)}
          >
            {category !== "associatedCasesNames" && element}
            {category === "associatedCasesNames" &&
              typeof element === "object" &&
              element.label}
          </p>
        )
      )}
    </div>
  );

  const handleSelectElement = (
    value: string | { id: string; label: string },
    category: string
  ) => {
    if (category === "supervisorName") {
      const result = caseState.listSupervisor.find(
        (element) => element.name === value
      );
      setValuesInputs({
        ...valuesInputs,
        [category]: {
          ...valuesInputs[category],
          value,
          lists: {
            ...valuesInputs[category].lists,
            isOpen: !valuesInputs[category].lists?.isOpen,
          },
        },
        service: {
          ...valuesInputs.service,
          value: result?.service || "",
        },
      });
    } else {
      let valueData;
      if (category === "associatedCasesNames" && typeof value === "object") {
        const findDoubleValue = valuesInputs.associatedCasesNames.value.find(
          (el: string) => el === value.label
        );
        if (findDoubleValue) {
          toast.warning("Vous avez déjà ajouté cette affaire");
          return;
        }
        valueData = [...valuesInputs.associatedCasesNames.value];
        valueData.splice(valueData.length, 0, value.label);
      } else {
        valueData = value;
      }
      setValuesInputs({
        ...valuesInputs,
        [category]: {
          ...valuesInputs[category],
          value: valueData,
          lists: valuesInputs[category].lists
            ? {
                ...valuesInputs[category].lists,
                isOpen: !valuesInputs[category].lists?.isOpen,
              }
            : undefined,
        },
      } as ValuesInputsProps);
    }
  };

  const handleChangeValue = (
    e: React.FormEvent<HTMLInputElement>,
    category: string
  ) => {
    setValuesInputs({
      ...valuesInputs,
      [category]: {
        ...valuesInputs[category],
        value: e.currentTarget.value,
      },
    });
  };

  const handleGroupDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const copyValueAssociatedName = [
      ...valuesInputs.associatedCasesNames.value,
    ];
    copyValueAssociatedName.splice(index, 1);
    setValuesInputs({
      ...valuesInputs,
      associatedCasesNames: {
        ...valuesInputs.associatedCasesNames,
        value: copyValueAssociatedName,
      },
    });
  };

  return (
    <Modal
      isOpen
      icon={<IconCase fill="#fff" transform="scale(1.5)" />}
      onClose={hideModal}
      title="Créer une nouvelle affaire"
      hasOverlay={false}
      className={styles.createCase}
      footer={
        <div className={styles.caseFooter}>
          <Button
            onClick={hideModal}
            type="secondary"
            className={cx(styles.buttonFooter, styles.cancel)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmitCreateCase}
            type="tertiary"
            className={styles.buttonFooter}
          >
            Créer une nouvelle affaire
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        {Object.entries(valuesInputs).map((element: Array<any>) => (
          <div key={element[0]} className={styles.setInputs}>
            <p className={styles.title}>
              {element[1].label}
              {requiredFields[element[0]] && (
                <span className={styles.asterix}>*</span>
              )}
            </p>
            {element[1].isArrow ? (
              <>
                {element[0] === "associatedCasesNames" ? (
                  <>
                    <InputGroupedValue
                      values={element[1].value}
                      onClick={() => handleOpenCategory(element[0])}
                      readOnly={element[1]?.readOnly}
                      handleGroupedDelete={handleGroupDelete}
                      iconArrow={
                        <IconArrow fill="#94969A" width={40} height={20} />
                      }
                    />
                  </>
                ) : (
                  <Input
                    placeholder={element[1].placeholder}
                    iconArrow={
                      <IconArrow fill="#94969A" width={40} height={20} />
                    }
                    value={element[1].value}
                    className={styles.input}
                    onChange={
                      element[0] === "parentGroup"
                        ? (e) => handleChangeValue(e, element[0])
                        : undefined
                    }
                    onClick={() => handleOpenCategory(element[0])}
                    readOnly={element[1]?.readOnly}
                  />
                )}
                {element[1].lists.isOpen && (
                  <List
                    selectElement={handleSelectElement}
                    category={element[0]}
                  />
                )}
              </>
            ) : (
              <Input
                placeholder={element[1].placeholder}
                value={element[1].value}
                className={styles.input}
                onChange={(e) => handleChangeValue(e, element[0])}
                readOnly={element[1]?.readOnly}
              />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CreateCase;
