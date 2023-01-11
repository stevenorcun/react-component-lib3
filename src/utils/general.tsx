/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React from "react";
import _ from "lodash";

import { EntityDto } from "@/API/DataModels/Database/NovaObject";

import IconArrowTopFull from "@/assets/images/icons/IconArrowTopFull";
import IconArrowBottomFull from "@/assets/images/icons/IconArrowBottomFull";
import IconArrowDown from "@/assets/images/icons/IconArrowDown";
import IconArrowTop from "@/assets/images/icons/IconArrow";

export const iconArrow = (field: boolean) =>
  field ? (
    <IconArrowBottomFull style={{ marginLeft: ".5rem" }} />
  ) : (
    <IconArrowTopFull style={{ marginLeft: ".5rem" }} />
  );

export const isOpenCategory = (isTrue: boolean) =>
  isTrue ? <IconArrowDown /> : <IconArrowTop />;

export const sortAlphabeticallyAsc = (field: string) => (a: any, b: any) => {
  if (
    (a[field] === undefined && b[field] === undefined) ||
    a[field] === b[field]
  ) {
    return 0;
  }
  return a.value
    ? a.value[field]?.toLowerCase() < b.value[field]?.toLowerCase()
      ? -1
      : 1
    : a[field]?.toLowerCase() < b[field]?.toLowerCase()
    ? -1
    : 1;
};

export const sortAlphabeticallyDesc = (field: string) => (a: any, b: any) => {
  if (
    (a[field] === undefined && b[field] === undefined) ||
    a[field] === b[field]
  ) {
    return 0;
  }
  return a.value
    ? a.value[field]?.toLowerCase() < b.value[field]?.toLowerCase()
      ? 1
      : -1
    : a[field]?.toLowerCase() < b[field]?.toLowerCase()
    ? 1
    : -1;
};

export const sortAsc = (field: string) => (a: any, b: any) =>
  a.value ? a.value[field] - b.value[field] : a[field] - b[field];

export const sortDesc = (field: string) => (a: any, b: any) =>
  a.value ? b.value[field] - a.value[field] : b[field] - a[field];

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

/**
 * Extract html string from HTMLElement (and potentially css)
 * @param element Element from which the html is extracted
 * @param styles Array of styles used to customize the extracted html
 * @param useCss If true, extract the stylesheets from the DOM
 * @returns Array of styles and html content to produce a new html page
 */
export const extractHtml = (
  element: HTMLElement,
  styles: string[] = [],
  useCss?: boolean
) => {
  const strArray: string[] = [];
  if (useCss) {
    const styleSheets = Array.from(document.styleSheets).map((s) => {
      try {
        const cssRulesArray = s.cssRules;
        return Array.from(cssRulesArray)?.reduce((css, value) => {
          let cssString = css;
          cssString += value.cssText;
          return cssString;
        }, "");
      } catch (error) {
        return "";
      }
    });
    const pageStylesFormatted = styles.concat(
      styleSheets.map((s) => `<style>${s}</style>`)
    );
    strArray.push(...pageStylesFormatted);
  }
  const nodeClone = element.cloneNode(true);
  // @ts-ignore
  const elementClone: Element =
    nodeClone.nodeType === Node.ELEMENT_NODE ? nodeClone : element;
  const childrenToRemove = elementClone.querySelectorAll(
    "[data-unextractable]"
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const el of Array.from(childrenToRemove)) {
    el.remove();
  }
  strArray.push(elementClone.outerHTML);
  return strArray;
};

/**
 * Minimum number of properties that must be equal in value
 * in order to allow the fusion of two entity DTO
 */
export const MINIMUM_EQUAL_PROPERTIES_REQUIRED_FOR_FUSION = 3;
/**
 * Returns true if the argument is of a primitive type or null or undefined
 */
export const isPrimitive = (val: any) =>
  val === null ||
  val === undefined ||
  !(
    typeof val === "object" ||
    typeof val === "function" ||
    typeof val === "symbol"
  );

/**
 * Returns an array with unique elements only
 * Used when fusing elements
 */
export const uniqueArray: (arr: any[]) => any[] = (ara: any[]) =>
  ara.reduce((acc, e) => {
    if (acc.every((obj) => !_.isEqual(obj, e))) acc.push(e);
    return acc;
  }, []);

// SYKE
export const autoMergeProps = (a, b, key) => {
  // a && !b => a
  if (a !== undefined && b === undefined) return a;
  // !a && b => b
  if (a === undefined && b !== undefined) return b;

  // typeof a !== typeof b => THROW
  if (typeof a !== typeof b) {
    throw {
      key,
      message: `[${key}] ${a} (${typeof a}) et ${b} (${typeof b}) ne sont pas compatibles`,
    };
  }

  // a && b are both primitives => must be equal
  if (isPrimitive(a) && isPrimitive(b)) {
    if (a === b) return a;
    throw {
      key,
      message: `Impossible de fusionner [${key}]: ${a} et ${b} ne sont pas égaux`,
    };
  }

  // Array.isArray(a) => return a.concat(b) + make it unique
  if (Array.isArray(a) && Array.isArray(b)) {
    return uniqueArray([...a, ...b]);
  }

  // typeof a === object => return autoMergeEntityDTOs(a, b, key) car loop sur les clefs
  if (typeof a === "object") {
    try {
      const { result, failures } = autoMergeEntityDTOs(a, b);
      if (Object.keys(failures).length) {
        throw {
          key,
          message: `Impossible de fusionner [${key}]: Les sous propriétés ${Object.keys(
            failures
          ).join(", ")} ne sont pas égales`,
        };
      }
      return { result, failures };
    } catch (e) {
      throw {
        key,
        message: `Impossible de fusion les sous-objets${a} et ${b} (${
          (e as any).key
        }).`,
      };
    }
  }

  throw { key, message: "La fusion a échouée" };
};

export const autoMergeEntityDTOs = (
  e1: EntityDto | object,
  e2: EntityDto | object
) => {
  // loop on all non forbidden keys
  // count successes and failures. OK if:
  //  -> success count > MINIMUM_EQUAL_PROPERTIES_REQUIRED_FOR_FUSION
  //  -> failures count < 0
  // else THROW

  // TODO use ENTITY_PROPERTY_DETAILS.isMeta
  const ignoredKeys = [
    "id",
    "__properties",
    "updatedAt",
    "updatedBy",
    "createdAt",
    "createdBy",
    "related",
  ].reduce((acc, k) => ({ ...acc, [k]: true }), {});

  const failures: { [key: string]: boolean } = {};
  const result = {};

  Object.keys(e1).forEach((key) => {
    if (ignoredKeys[key]) return;

    try {
      result[key] = autoMergeProps(e1[key], e2[key], key);
    } catch (e: { key: string; message: string } | any) {
      // console.warn('Failed to merge', `<${key}>.`, e.message);
      failures[key] = true;
    }
  });

  // loop on e2 and push all keys missing from RESULT
  Object.keys(e2).forEach((key) => {
    if (ignoredKeys[key] || failures[key] || result[key]) return;

    result[key] = e2[key];
  });

  // flatten related and merge
  if (
    typeof (e1 as EntityDto).related === "object" &&
    typeof (e2 as EntityDto).related === "object"
  ) {
    const flattenRelated = (e: EntityDto) =>
      Object.keys(e.related)
        .map((key) => e.related[key]?.values || [])
        .flat();
    // TODO remove dupplications with forEach + lodash.isEqual
    // @ts-ignore
    result.related = [
      ...flattenRelated(e1 as EntityDto),
      ...flattenRelated(e2 as EntityDto),
    ];
  }

  return {
    failures,
    result,
  };
};
