import camelCase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";

// @ts-ignore
const requireComponent = require.context(".", false, /base-[\w-]+\.tsx$t/);

const icons = {};

requireComponent.keys().forEach((filename) => {
  const componentName = upperFirst(
    camelCase(filename.replace(/^\.\//, "")).replace(/\.\w+$/, "")
  );
  // @ts-ignore
  icons[componentName] = requireModule(filename);
});

export default icons;
