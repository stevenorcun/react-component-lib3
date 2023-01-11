import {
  EditorState,
  ContentBlock,
  genKey,
} from 'draft-js';

/**
 * Check if the `blockKey` corresponds to the last block in the page
 * @param editorState EditorState of the page
 * @param blockKey Key of a content block
 * @returns True if the block is the last block of the page
 */
export const isLastBlock = (editorState: EditorState, blockKey: string): boolean => {
  const contentState = editorState.getCurrentContent();
  const lastBlock = contentState.getLastBlock();
  return blockKey === lastBlock.getKey();
};

/**
 * Check if the block is an atomic block, or if its next or previous block is an atomic block.
 * @param editorState EditorState of the page
 * @param blockKey Key of a content block
 * @returns True if the block is a part of an atomic group
 */
export const isAtomicBlock = (editorState: EditorState, blockKey: string): boolean => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(blockKey);
  const previousContentBlock = contentState.getBlockBefore(blockKey);
  const nextContentBlock = contentState.getBlockAfter(blockKey);
  return (
    contentBlock?.getType() === 'atomic'
    || previousContentBlock?.getType() === 'atomic'
    || nextContentBlock?.getType() === 'atomic'
  );
};

/**
 * Get the blocks in an atomic group. That means, if the content block with `blockKey` key is an atomic block
 * or is adjacent to an atomic block, get the atomic block and its two adjacent blocks.
 * @param editorState EditorState of the page
 * @param blockKey Key of a content block
 * @returns List of content blocks
 */
export const getAtomicGroup = (editorState: EditorState, blockKey: string): ContentBlock[] => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getBlockForKey(blockKey);
  let contentBlocks = [contentBlock];
  if (!isAtomicBlock(editorState, blockKey)) {
    return contentBlocks;
  }
  const previousContentBlock = contentState.getBlockBefore(blockKey);
  const nextContentBlock = contentState.getBlockAfter(blockKey);
  if (contentBlock.getType() === 'atomic') {
    contentBlocks = [previousContentBlock, contentBlock, nextContentBlock];
  }
  if (previousContentBlock?.getType() === 'atomic') {
    const secondContentBlock = contentState.getBlockBefore(previousContentBlock.getKey());
    contentBlocks = [secondContentBlock, previousContentBlock, contentBlock];
  }
  if (nextContentBlock?.getType() === 'atomic') {
    const secondContentBlock = contentState.getBlockAfter(nextContentBlock.getKey());
    contentBlocks = [contentBlock, nextContentBlock, secondContentBlock];
  }
  return contentBlocks;
};

/**
   * Insert a new empty content block in editor before or after the selection
   * @param direction Position to insert the new block (before or after the selection)
   * @param editorState
   * @returns New editor state with inserted content block
   */
export const insertContentBlock = (direction: 'before' | 'after', editorState: EditorState): EditorState => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const currentBlock = contentState.getBlockForKey(selection.getEndKey());

  const blockMap = contentState.getBlockMap();
  // Split the blocks
  const blocksBefore = blockMap.toSeq().takeUntil((v) => v === currentBlock);
  const blocksAfter = blockMap.toSeq().skipUntil((v) => v === currentBlock).rest();
  const newBlockKey = genKey();
  const newBlocks = direction === 'before' ? [
    [newBlockKey, new ContentBlock({
      key: newBlockKey,
    })],
    [currentBlock.getKey(), currentBlock],
  ] : [
    [currentBlock.getKey(), currentBlock],
    [newBlockKey, new ContentBlock({
      key: newBlockKey,
    })],
  ];
  const newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap();
  const newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection,
  });
  return EditorState.push(editorState, newContentState, 'insert-fragment');
};
