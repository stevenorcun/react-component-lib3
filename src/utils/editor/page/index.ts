import { toast } from 'react-toastify';

/**
 * Check if the editor content is longer than the max page height
 * @param ref Reference of the editor element
 * @param zoom Zoom of the document
 * @param totalHeight Max height of a page (with normal zoom)
 * @returns True if the current page height is longer than the max page height
 */
export const checkPageHeight = (ref, zoom = 1, totalHeight = 1082) => {
  const maxHeight = totalHeight * zoom; // Height of a page
  const height = ref?.editor?.children?.[0].offsetHeight;
  return height && height > maxHeight;
};

/**
 * Get the overflow height of the editor content
 * @param ref Reference of the editor element
 * @param zoom Zoom of the document
 * @param totalHeight Max height of a page (with normal zoom)
 * @returns Overflow height
 */
export const calculateHeightOverflow = (ref, zoom = 1, totalHeight = 1082) => {
  if (!checkPageHeight(ref, zoom, totalHeight)) {
    return 0;
  }
  const maxHeight = totalHeight * zoom; // Height of a page
  const height = ref?.editor?.children?.[0].offsetHeight;
  if (!height) {
    return undefined;
  }
  return height - maxHeight;
};

/**
 * Get the list of content block's keys that overflow with the page
 * @param ref Reference of the editor element
 * @param zoom Zoom of the document
 * @param totalHeight Max height of a page (with normal zoom)
 * @returns List of block's keys
 */
export const getOverflowBlockKeys = (ref, zoom = 1, totalHeight = 1082): string[] => {
  const overflowHeight = calculateHeightOverflow(ref, zoom, totalHeight);
  if (!overflowHeight) {
    return [];
  }
  const contentElement = ref?.editor?.children?.[0];
  const blocksElement = contentElement?.querySelectorAll('[data-block="true"]');
  if (!blocksElement?.length) {
    return [];
  }
  let index = blocksElement.length - 1;
  let height = 0;
  const blockKeys: string[] = [];
  while (height < overflowHeight && index >= 0) {
    height += blocksElement[index].offsetHeight;
    const key = blocksElement[index].getAttribute('data-offset-key').split('-')[0];
    blockKeys.unshift(key);
    index -= 1;
  }
  return blockKeys;
};

/**
 * Get the height of a list of blocks
 * @param ref Reference of the editor element
 * @param blockKeys List of block's keys
 * @returns Height of blocks
 */
const calculateHeightGroupBlocks = (ref, blockKeys: string[]) => {
  const blockRefs = blockKeys.map(
    (blockKey) => ref?.editor?.children?.[0].querySelector(`[data-offset-key="${blockKey}-0-0"]`),
  );
  const height = blockRefs.reduce((previousValue, blockRef) => {
    let blockHeight = blockRef?.offsetHeight;
    if (blockRef) {
      const style = getComputedStyle(blockRef);
      blockHeight += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
    }
    if (blockHeight) {
      return previousValue + blockHeight;
    }
    throw Error('Unable to get block height');
  }, 0);
  return height;
};

/**
 * Check if a list of blocks can be added to a target page (without creating an overflow)
 * @param targetRef Reference of the targetted editor element
 * @param ref Reference of the editor element
 * @param blockKeys List of block's keys
 * @param zoom Zoom of the document
 * @param totalHeight Max height of a page (with normal zoom)
 * @returns True if blocks can be added to the target page
 */
export const checkAddToPage = (
  targetRef,
  ref,
  blockKeys: string[],
  zoom = 1,
  totalHeight = 1082,
) => {
  try {
    const maxHeight = totalHeight * zoom; // Height of a page
    const pageContentHeight = targetRef?.editor?.children?.[0].offsetHeight;
    const blockHeight = calculateHeightGroupBlocks(ref, blockKeys);
    return (
      pageContentHeight
      && blockHeight
      && pageContentHeight + blockHeight < maxHeight
    );
  } catch (error: any) {
    toast.error(error);
    return false;
  }
};
