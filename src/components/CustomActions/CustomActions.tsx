import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import BaseApi from "@/API/controllers/base-api";
import { EntityDto } from "@/API/DataModels/Database/NovaObject";
import {
  CUSTOMIZED_ACTION_CALLBACK,
  CustomizedActionsType,
} from "@/constants/customization";
// Hook imports
import { useGlobalModalContext } from "@/hooks/useGlobalModal";
// Store imports
import { useAppSelector } from "@/store/hooks";
import {
  ActionState,
  selectCustomizedActions,
} from "@/store/customizedActions";
import { selectTags } from "@/store/tags";
// Component imports
import Options from "@/components/Options/Options";
// Icon imports
import IconArrow from "@/assets/images/icons/IconArrow";
import IconLoader from "@/assets/images/icons/IconLoader";

import styles from "./styles.scss";

interface CustomActionsProps {
  actionsKey: string;
  entity?: EntityDto;
  file?: any;
}

const CustomActions = ({ actionsKey, entity, file }: CustomActionsProps) => {
  const actionsState = useAppSelector(selectCustomizedActions);
  const tagsState = useAppSelector(selectTags);
  const [isOpenedActionsMenu, setIsOpenedActionsMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(undefined);

  const { showModal } = useGlobalModalContext();

  const getBlobFromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return blob;
  };

  // Authorized object to process as value in parseBody
  const authorizedObject = ["entity", "file"];

  /**
   * Parse a JSON string that may contain values to process (with format *{{value.prop}}* )
   * @param requestBody Request's body in JSON string format, which can contain values to process
   * @returns JSON body
   */
  const parseBody = (requestBody: string) => {
    let body = requestBody;
    // Get all the values to process
    const matches = requestBody.match(/{{.*}}/g);
    if (!matches) {
      return JSON.parse(requestBody);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      // Get the property's path
      const matchParsed = match.replace(/{|}/g, "").trim();
      const mappingProps = matchParsed.split(".");
      if (mappingProps && authorizedObject.includes(mappingProps[0])) {
        // TODO Get the property value for all possible object, not only the entity
        if (mappingProps && mappingProps[0] === "entity") {
          let value: any = "";
          value = entity;
          if (mappingProps.length > 1) {
            for (let i = 1; i < mappingProps.length; i++) {
              const prop = mappingProps[i];
              value = value[prop];
            }
          }
          value = JSON.stringify(value);
          body = body.replace(/{{.*}}/, value);
        } else {
          body = body.replace(/"?{{.*}}"?/, '"$&"');
        }
      } else {
        throw new Error(`Unable to parse ${match}`);
      }
    }
    return JSON.parse(body);
  };

  const formatApiReturn = (data, format?: string) => {
    let dataMapped = data;
    if (format === "JSON") {
      dataMapped = JSON.parse(JSON.stringify(data));
    }
    if (format === "XML") {
      const parser = new DOMParser();
      dataMapped = parser.parseFromString(data, "text/xml");
    }
    return dataMapped;
  };

  const getValue = (value, prop, format?: string) => {
    let result;
    if (format === "JSON") {
      result = value[prop];
    }
    if (format === "XML") {
      // Get attribute if exist
      let attribute;
      const propSplitted = prop.split("[");
      if (propSplitted.length > 1) {
        [attribute] = propSplitted[1].split("]");
      }
      result = value.getElementsByTagName(propSplitted[0]);
      if (result.length === 1) {
        [result] = result;
      }
      if (attribute) {
        result = result.getAttribute(attribute);
      }
    }
    return result;
  };

  const callApi = (action: ActionState, postData?: any): void => {
    if (!action) {
      return;
    }
    if (!action.path) {
      toast.error("Url invalide");
      return;
    }
    const api = new BaseApi(action.path);
    if (api) {
      api
        .request(
          // @ts-ignore
          action.requestMethod,
          action.headers,
          postData,
          (status, data) => {
            if (action.callback) {
              let dataMapped = formatApiReturn(data, action.callbackFormat);
              if (action.callbackMapping) {
                const mappingGroups = action.callbackMapping.split(";");
                if (mappingGroups.length > 0) {
                  dataMapped = [];
                  // eslint-disable-next-line no-restricted-syntax
                  for (const group of mappingGroups) {
                    const mappingProps = group.split(".");
                    let value = formatApiReturn(data, action.callbackFormat);
                    // eslint-disable-next-line no-restricted-syntax
                    for (const prop of mappingProps) {
                      value = getValue(value, prop, action.callbackFormat);
                    }
                    if (
                      action.callbackFormat === "XML" &&
                      typeof value === "object"
                    ) {
                      value = value.nodeValue;
                    }
                    dataMapped.push(value);
                  }
                }
                if (mappingGroups.length === 1) {
                  [dataMapped] = dataMapped;
                }
              }
              CUSTOMIZED_ACTION_CALLBACK[action.callback].useCallback(
                dataMapped,
                { entity, file },
                showModal
              );
            }
          }
        )
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error in api call");
        });
    }
  };

  /**
   * Define the function to execute on click on the action button
   * @param action Custom action
   * @returns Function to execute
   */
  const actionOnClick = (action: ActionState) => {
    let onClick = () => {};
    if (!action || !action.actionType || !action.path) {
      return onClick;
    }
    if (
      +action.actionType === CustomizedActionsType.API &&
      action.requestMethod
    ) {
      onClick = async () => {
        setLoading(true);
        try {
          let formData: any;
          if (action.requestBody) {
            const { requestBody } = action;
            const body = parseBody(requestBody);
            // If content-type is form-data, we can't pass the data in JSON
            if (
              action.headers &&
              action.headers["Content-Type"] &&
              action.headers["Content-Type"].includes("multipart/form-data")
            ) {
              formData = new FormData();
              // eslint-disable-next-line no-restricted-syntax
              for (const key in body) {
                if (body[key]) {
                  const value = body[key];
                  // Get blob if the value is {{ file }}
                  if (
                    typeof value === "string" &&
                    value.match(/{{ *file *}}/g)
                  ) {
                    if (!file) {
                      throw new Error("No file !");
                    }
                    const { path } = file.value;
                    const imageBinary = await getBlobFromUrl(path);
                    formData.append(key, imageBinary);
                  } else {
                    formData.append(key, value);
                  }
                }
              }
              // TODO Check if there is other exceptions, depending on headers for example
            } else {
              formData = body;
            }
          }
          callApi(action, formData);
        } catch (e: any) {
          let error = e;
          if (typeof error !== "string") {
            if (e.message) {
              error = e.message;
            }
          }
          toast.error(error);
          setLoading(false);
        }
      };
    }
    return onClick;
  };

  const formatAction = (action: ActionState) => {
    const formattedAction = {
      id: action.id,
      keys: action.keys,
      label: action.label,
      enabled: action.enabled,
      tags: action.tags,
      objectTypes: action.objectTypes,
      onClick: () => {},
    };
    if (action.actionType && action.path) {
      formattedAction.onClick = actionOnClick(action);
    }
    return formattedAction;
  };

  const formatActions = (actions: ActionState[]) => {
    const formattedActions: any[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const action of actions) {
      formattedActions.push(formatAction(action));
    }
    return formattedActions;
  };

  const filterActions = (actions: ActionState[]) =>
    actions.filter(
      (a) =>
        a.enabled &&
        a.keys.includes(actionsKey) &&
        a.objectTypes.includes(entity!.type) &&
        a.tags.every((t) =>
          currentUser?.tags.find((ta) => ta.label === t.label)
        )
    );

  const [actions, setActions] = useState(
    filterActions(formatActions(actionsState.actions))
  );

  const toggleMenu = () => {
    setIsOpenedActionsMenu(!isOpenedActionsMenu);
  };

  const loadActions = async () => {
    try {
      setActions(filterActions(formatActions(actionsState.actions)));
    } catch (err) {
      const baseMsg = "Erreur de chargement des données";
      const msg = err ? `${baseMsg}\r\n${err}` : baseMsg;
      toast.error(msg);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  useEffect(() => {
    if (isOpenedActionsMenu) {
      document.addEventListener("click", toggleMenu);
    }
    return () => {
      document.removeEventListener("click", toggleMenu);
    };
  }, [isOpenedActionsMenu]);

  useEffect(() => {
    if (actions && actions.length > 0) {
      setList(actions);
    } else {
      setList([]);
    }
  }, [actions]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const user = tagsState?.users.find((u) => u.user._id === userId);
    setCurrentUser(user?.user);
  }, [tagsState?.users]);

  return (
    <>
      {list && list.length > 0 && (
        <div className={styles.customActionsMenuContainer}>
          <span className={styles.openIn} onClick={toggleMenu}>
            Actions&nbsp;
            {loading ? (
              <IconLoader fill="#3083f7" width={20} />
            ) : (
              <IconArrow
                style={{
                  transform: "rotate(90deg) scale(0.7)",
                  fill: "#3083f7",
                }}
              />
            )}
          </span>
          {isOpenedActionsMenu && (
            <Options
              className={styles.customActionsMenu}
              list={list}
              setOpen={setIsOpenedActionsMenu}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CustomActions;
