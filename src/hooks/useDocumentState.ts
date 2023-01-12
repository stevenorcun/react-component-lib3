/**
 * Hook used to manage state of a document with multi-pages features
 */

/* eslint-disable no-restricted-syntax */
import { useState, useLayoutEffect, useReducer } from "react";
import { toast } from "react-toastify";
import {
  EditorState,
  ContentState,
  SelectionState,
  ContentBlock,
  Modifier,
  CompositeDecorator,
  genKey,
} from "draft-js";
import {
  calculateHeightOverflow,
  checkPageHeight,
  checkAddToPage,
  getAtomicGroup,
  isLastBlock,
  getOverflowBlockKeys,
  insertContentBlock,
} from "../utils/editor";

export interface DocumentStateOptions {
  decorator?: CompositeDecorator;
  zoom?: number;
}

export function useDocumentState(initState?, options?: DocumentStateOptions) {
  const [currentEditorStateIndex, setCurrentEditorStateIndex] = useState(0);
  /**
   * Dispatch action to remove pages
   * @param editorStates Array of editor states
   * @param index Index (or array of indexes) of pages to remove
   * @returns New states without the removed pages
   */
  const removeStates = (editorStates, index: number | number[]) => {
    const states = [...editorStates];
    if (!index) {
      return states;
    }
    let minIndex = states.length;
    if (Array.isArray(index)) {
      for (const i of index) {
        if (i !== 0) {
          states.splice(i, 1);
          minIndex = i < minIndex ? i : minIndex;
        }
      }
    } else {
      states.splice(index, 1);
      minIndex = index;
    }
    setCurrentEditorStateIndex(minIndex - 1);
    states[minIndex - 1]?.ref?.editor.focus();
    return states;
  };

  /**
   * Dispatch action to update pages
   * @param editorStates Array of editor states
   * @param index Index (or array of indexes) of pages to remove
   * @param payload New states to apply
   * @returns New states with updated pages
   */
  const updateStates = (
    editorStates,
    index: number | number[],
    payload: any
  ) => {
    const states = [...editorStates];
    if (
      index === undefined ||
      index === null ||
      (Array.isArray(index) && !index.length)
    ) {
      return states;
    }
    if (Array.isArray(index)) {
      if (!Array.isArray(payload)) {
        return states;
      }
      for (const i in index) {
        if (states[index[i]] && payload[i]) {
          states[index[i]] = {
            state: payload[i],
            ref: states[index[i]].ref,
          };
        }
      }
    } else if (states[index]) {
      states[index] = {
        state: payload,
        ref: states[index].ref,
      };
    }
    return states;
  };
  const stateReducer = (
    state: {
      state: EditorState;
      ref: any;
    }[],
    action
  ) => {
    let states = [...state];
    let newState;
    switch (action.type) {
      case "new":
        newState = {
          state: EditorState.createEmpty(options?.decorator),
          ref: undefined,
        };
        states.push(newState);
        break;
      case "remove":
        states = removeStates(states, action.index);
        break;
      case "set":
        if (action.payload && action.payload.length) {
          states = action.payload.map((content) => ({
            state: EditorState.createWithContent(content, options?.decorator),
            ref: undefined,
          }));
        }
        break;
      default:
        states = updateStates(states, action.index, action.payload);
        break;
    }
    return [...states];
  };
  const [editorStates, dispatchStates] = useReducer<
    (
      state: {
        state: EditorState;
        ref: any;
      }[],
      action: any
    ) => {
      state: EditorState;
      ref: any;
    }[]
  >(
    stateReducer,
    initState && initState.length
      ? initState.map((content) => ({
          state: EditorState.createWithContent(content, options?.decorator),
          ref: undefined,
        }))
      : [
          {
            state: EditorState.createEmpty(options?.decorator),
            ref: undefined,
          },
        ]
  );

  /**
   * Give the focus to a document's page
   * @param index Page's index
   */
  const focusPage = (index: number) => {
    editorStates[index]?.ref?.editor.focus();
  };

  /**
   * Add a new page in the document
   */
  const addNewPage = () => {
    dispatchStates({ type: "new" });
  };

  /**
   * Remove a page from the document
   * @param index Page's index
   */
  const removePage = (index: number) => {
    dispatchStates({ index, type: "remove" });
  };

  /**
   * Split the text inside a given content block between the page at the `index` position in the document and the next page.
   * The text is splitted by removing the last word from `contentBlock` and adding it at the end of the first content block in the next page.
   * @param index Page's index
   * @param contentBlock Content block of the editor that will be splited
   */
  const splitText = (index: number, contentBlock: ContentBlock) => {
    if (!editorStates[index + 1]) {
      return;
    }
    const currentState = editorStates[index].state;
    const contentState = currentState.getCurrentContent();
    const selectionState = currentState.getSelection();
    const words = contentBlock.getText().split(" ");
    const lastWord = words[words.length - 1];
    // Remove word from current page
    const wordSelection = selectionState.merge({
      anchorOffset: selectionState.getAnchorOffset() - lastWord.length,
    });
    const newContentState = Modifier.replaceText(
      contentState,
      wordSelection,
      ""
    );
    // Write word in next page
    const nextEditorState = editorStates[index + 1]?.state;
    const nextSelectionState = nextEditorState.getSelection();
    const firstBlockKey = nextEditorState
      .getCurrentContent()
      ?.getFirstBlock()
      ?.getKey();
    const nextSelectionStateStart = nextSelectionState.merge({
      anchorKey: firstBlockKey,
      anchorOffset: 0,
      focusKey: firstBlockKey,
      focusOffset: 0,
    });
    const res = Modifier.insertText(
      nextEditorState.getCurrentContent(),
      nextSelectionStateStart,
      lastWord
    );
    dispatchStates({
      index: [index, index + 1],
      payload: [
        EditorState.push(
          currentState,
          newContentState,
          "split-characters-page"
        ),
        EditorState.push(nextEditorState, res, "split-characters-page"),
      ],
    });
  };

  /**
   * Add new empty content block at the extremity of a content blocks list.
   * A new content block is added if the block before or after the selected content blocks is an *atomic* block.
   *
   * This function is used to prepare the transfer of `contentBlocks` from one page to another, to avoid to let
   * an atomic block without a next or previous content block (which can cause an error).
   * @param editorState
   * @param contentBlocks List of following content blocks in the editor
   * @returns Editor state with added lines
   */
  const addNewLineBetweenAtomicGroupChained = (
    editorState: EditorState,
    contentBlocks: ContentBlock[]
  ) => {
    // Atomic group
    if (contentBlocks.length < 3) {
      return editorState;
    }
    const contentState = editorState.getCurrentContent();
    const previousBlock = contentState.getBlockBefore(
      contentBlocks[0].getKey()
    );
    const nextBlock = contentState.getBlockAfter(
      contentBlocks[contentBlocks.length - 1].getKey()
    );
    let eState = editorState;
    if (previousBlock?.getType() === "atomic") {
      const newSelection = new SelectionState({
        anchorKey: previousBlock.getKey(),
        anchorOffset: previousBlock.getLength(),
        focusKey: previousBlock.getKey(),
        focusOffset: previousBlock.getLength(),
      });
      const editorStateSelection = EditorState.acceptSelection(
        editorState,
        newSelection
      );
      eState = insertContentBlock("after", editorStateSelection);
    }
    if (nextBlock?.getType() === "atomic") {
      const newSelection = new SelectionState({
        anchorKey: nextBlock.getKey(),
        anchorOffset: 0,
        focusKey: nextBlock.getKey(),
        focusOffset: 0,
      });
      const editorStateSelection = EditorState.acceptSelection(
        editorState,
        newSelection
      );
      eState = insertContentBlock("before", editorStateSelection);
    }
    return eState;
  };

  /**
   * Add content blocks in the editor
   * @param editorState EditorState of the page
   * @param contentBlocks List of content blocks
   * @param position Position in the editor block map to insert `contentBlocks`
   * @returns Content state with inserted content blocks
   */
  const addBlocksToPage = (
    editorState: EditorState,
    contentBlocks: ContentBlock[],
    position: number | "start" | "end"
  ): ContentState => {
    const contentState = editorState.getCurrentContent();
    const blockMapArray: any[] = contentState.getBlockMap().toArray();
    let newBlockMapArray = blockMapArray;
    const newContentBlocks: any[] = [];
    for (const contentBlock of contentBlocks) {
      if (!contentBlock) {
        throw Error("Unable to get data from contentBlock");
      }
      const newContentBlock = new ContentBlock({
        key: genKey(),
        type: contentBlock.getType(),
        characterList: contentBlock.getCharacterList(),
        text: contentBlock.getText(),
        depth: contentBlock.getDepth(),
        data: contentBlock.getData(),
      });
      newContentBlocks.push(newContentBlock);
    }
    if (position === "start") {
      newBlockMapArray = [...newContentBlocks, ...newBlockMapArray];
    } else if (position === "end") {
      newBlockMapArray = [...newBlockMapArray, ...newContentBlocks];
    } else {
      newBlockMapArray[position] = newContentBlocks[position];
    }
    return ContentState.createFromBlockArray(newBlockMapArray);
  };

  /**
   * Remove content blocks from the editor
   * @param currentState EditorState of the page
   * @param contentBlocks List of following content blocks
   * @returns Content state without removed content blocks
   */
  const removeBlocksFromPage = (
    currentState: EditorState,
    contentBlocks: ContentBlock[]
  ): ContentState => {
    const stateAddedLines = addNewLineBetweenAtomicGroupChained(
      currentState,
      contentBlocks
    );
    const contentState = stateAddedLines.getCurrentContent();
    const startBlock = contentBlocks[0];
    const endBlock = contentBlocks[contentBlocks.length - 1];
    const blockBefore = contentState.getBlockBefore(startBlock.getKey());
    const blockAfter = contentState.getBlockAfter(endBlock.getKey());
    let anchorKey = startBlock.getKey();
    let anchorOffset = 0;
    let focusKey = endBlock.getKey();
    let focusOffset = endBlock.getText().length;
    if (blockBefore) {
      anchorKey = blockBefore.getKey();
      anchorOffset = blockBefore.getText().length;
    }
    if (blockAfter) {
      focusKey = blockAfter.getKey();
      focusOffset = 0;
    }
    const removeSelection = new SelectionState({
      anchorKey,
      anchorOffset,
      focusKey,
      focusOffset,
    });
    const newContentState = Modifier.removeRange(
      contentState,
      removeSelection,
      "forward"
    );
    return newContentState;
  };

  /**
   * Split a list of blocks from one page to another
   * @param currentState EditorState of the page
   * @param contentBlocks An array of following ContentBlock
   * @param targetEditorState EditorState of the target page to copy splitted blocks
   * @param position Position where to copy the splitted blocks in the block map
   * @returns EditorStates of page and target page
   */
  const splitBlocks = (
    currentState: EditorState,
    contentBlocks: ContentBlock[],
    targetEditorState: EditorState,
    position: number | "start" | "end"
  ) => {
    if (!currentState || !targetEditorState || !contentBlocks?.length) {
      return undefined;
    }
    let contentBlocksWithAtomic = [...contentBlocks];
    if (contentBlocks.length === 1) {
      contentBlocksWithAtomic = getAtomicGroup(
        currentState,
        contentBlocks[0].getKey()
      );
    } else {
      const firstContentBlocksWithAtomic = getAtomicGroup(
        currentState,
        contentBlocks[0].getKey()
      );
      const lastContentBlocksWithAtomic = getAtomicGroup(
        currentState,
        contentBlocks[contentBlocks.length - 1].getKey()
      );
      contentBlocksWithAtomic = [
        ...firstContentBlocksWithAtomic,
        ...contentBlocksWithAtomic,
        ...lastContentBlocksWithAtomic,
      ];
      contentBlocksWithAtomic = contentBlocksWithAtomic.filter(
        (value, index) => contentBlocksWithAtomic.indexOf(value) === index
      );
    }
    // Add content block to target page
    let newTargetContentState = targetEditorState;
    try {
      newTargetContentState = addBlocksToPage(
        targetEditorState,
        contentBlocksWithAtomic,
        position
      );
    } catch (error: any) {
      toast.error(error);
      return undefined;
    }
    const newTargetES = EditorState.push(
      targetEditorState,
      newTargetContentState,
      "split-block-page"
    );
    // Remove content block from current page
    const newContentState = removeBlocksFromPage(
      currentState,
      contentBlocksWithAtomic
    );
    const newES = EditorState.push(
      currentState,
      newContentState,
      "split-block-page"
    );
    return {
      target: newTargetES,
      current: newES,
    };
  };

  /**
   * Split a list of blocks from the page in `index` position in the document at the beginning of the next page.
   * @param index Page's index
   * @param contentBlocks List of following content blocks
   */
  const splitBlockToNextPage = (
    index: number,
    contentBlocks: ContentBlock[]
  ) => {
    const currentState = editorStates[index]?.state;
    const states = splitBlocks(
      currentState,
      contentBlocks,
      editorStates[index + 1]?.state,
      "start"
    );
    if (!states) {
      return;
    }
    const selectionState = currentState.getSelection();
    let eState = states.current;
    if (isLastBlock(currentState, selectionState.getAnchorKey())) {
      focusPage(index + 1);
    } else if (
      states.current
        .getCurrentContent()
        .getBlockForKey(selectionState.getAnchorKey())
    ) {
      eState = EditorState.acceptSelection(states.current, selectionState);
    }
    dispatchStates({
      index: [index + 1, index],
      payload: [states.target, eState],
    });
  };

  /**
   * Split a list of blocks from the page in `index` position in the document at the end of the previous page.
   * @param index Page's index
   * @param contentBlocks List of following content blocks
   */
  const splitBlockToPreviousPage = (
    index: number,
    contentBlocks: ContentBlock[]
  ) => {
    const states = splitBlocks(
      editorStates[index]?.state,
      contentBlocks,
      editorStates[index - 1]?.state,
      "end"
    );
    if (!states) {
      return;
    }
    dispatchStates({
      index: [index - 1, index],
      payload: [states.target, states.current],
    });
  };

  /**
   * Manage a page overflow. If the content of the page is too long, split the overflowed blocks (or text) to the next page.
   * @param index Page's index
   */
  const manageOverflowPage = (index: number) => {
    const blockKeys = getOverflowBlockKeys(
      editorStates[index].ref,
      options?.zoom
    );
    if (!blockKeys?.length) {
      return;
    }
    // If this is the last page, add a new one
    if (index === editorStates.length - 1) {
      addNewPage();
    }
    const editorState = editorStates[index].state;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const lastChange = editorState.getLastChangeType();
    const lastBlock = contentState.getLastBlock();
    // If adding a character in the last line, split the text between current and next page
    if (
      lastChange === "insert-characters" &&
      selectionState.getStartKey() === lastBlock.getKey()
    ) {
      splitText(index, lastBlock);
      return;
    }
    const heightOverflow = calculateHeightOverflow(
      editorStates[index].ref,
      options?.zoom
    );
    // One block take all the page height
    if (heightOverflow && heightOverflow >= 1082 && blockKeys.length === 1) {
      toast.warning(
        "Un bloc de texte est trop grand. Diviser le bloc en ajoutant un retour à la ligne."
      );
      return;
    }
    const contentBlocks = blockKeys.map((key) =>
      contentState.getBlockForKey(key)
    );
    splitBlockToNextPage(index, contentBlocks);
  };

  // Manage page's features (adding, removing, transfer text, etc...)
  useLayoutEffect(() => {
    editorStates.forEach((currentState, index) => {
      if (checkPageHeight(currentState.ref, options?.zoom)) {
        // Split entire block
        // TODO: Not the best solution, cause the block can contain multiple lines
        // TODO: Need to split text inside the block
        manageOverflowPage(index);
        // If content is not too long and we have a next page
      } else if (editorStates[index + 1]) {
        const nextPageContentState =
          editorStates[index + 1].state.getCurrentContent();
        const nextPageFirstBlock = nextPageContentState.getFirstBlock();
        const nextPageFirstGroup = getAtomicGroup(
          editorStates[index + 1].state,
          nextPageFirstBlock.getKey()
        );
        const nextPageFirstGroupKeys = nextPageFirstGroup.map((block) =>
          block?.getKey()
        );
        // If the first block of next page can take the free place in current page, split the block
        if (
          nextPageContentState.hasText() &&
          nextPageFirstBlock &&
          checkAddToPage(
            currentState.ref,
            editorStates[index + 1].ref,
            nextPageFirstGroupKeys,
            options?.zoom
          )
        ) {
          splitBlockToPreviousPage(index + 1, [nextPageFirstBlock]);
        }
      }
    });
  }, [editorStates]);

  return {
    focusPage,
    focusPageIndex: currentEditorStateIndex,
    setFocusPageIndex: setCurrentEditorStateIndex,
    editorStates,
    dispatchStates,
    addPage: addNewPage,
    removePage,
  };
}
