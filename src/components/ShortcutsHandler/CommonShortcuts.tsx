/* eslint-disable no-restricted-syntax */

const preventDefaultHandlers = (handlers) => {
  const newHandlers = {};
  for (const [action, handler] of Object.entries(handlers)) {
    newHandlers[action] = (event) => {
      if (event) {
        event.preventDefault();
      }
      // @ts-ignore
      handler();
    };
  }
  return newHandlers;
};

export default preventDefaultHandlers;
