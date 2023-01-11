/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useState, useEffect } from "react";
import {
  EditorState,
  SelectionState,
  RichUtils,
  Modifier,
  DefaultDraftBlockRenderMap,
  getDefaultKeyBinding,
} from "draft-js";
import Editor, {
  composeDecorators,
  EditorPlugin,
} from "@draft-js-plugins/editor";
import createFocusPlugin from "@draft-js-plugins/focus";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import createAlignmentPlugin from "@draft-js-plugins/alignment";
import { styleMap } from "@/constants/editor";
import createImagePlugin from "@/components/CustomEditor/plugins/image";
import createNovaObjectsPlugin from "@/components/CustomEditor/plugins/novaObjects";
import "@draft-js-plugins/alignment/lib/plugin.css";
import IconLoader from "@/assets/images/icons/IconLoader";
import styles from "./styles.scss";

interface EditorSinglePageProps {
  editorState: EditorState;
  setEditorState?: React.Dispatch<any>;
  onChange?: (state: EditorState, index?: number) => void;
  documentState?: EditorState[];
  pageNum?: number;
  readOnly?: boolean;
  spellCheck?: boolean;
  setContextMenuEntityProps?: React.Dispatch<any>;
  changeDepth?: (e: React.SyntheticEvent) => void;
  onFocus?: (index?: number) => void;
  deleteFn?: (index?: number) => void;
}

const defaultProps = {
  setEditorState: () => {},
  onChange: () => {},
  documentState: undefined,
  pageNum: undefined,
  readOnly: false,
  spellCheck: false,
  setContextMenuEntityProps: () => {},
  changeDepth: () => {},
  onFocus: () => {},
  deleteFn: () => {},
};

const EditorSinglePage = React.forwardRef(
  (
    {
      editorState,
      setEditorState,
      onChange,
      documentState,
      pageNum,
      readOnly,
      spellCheck,
      setContextMenuEntityProps,
      changeDepth,
      onFocus,
      deleteFn,
    }: EditorSinglePageProps,
    ref
  ) => {
    // Plugins
    const focusTheme = {
      unfocused: styles.unfocused,
      focused: styles.focused,
    };
    const [plugins, setPlugins] = useState<EditorPlugin[]>();
    const [AlignmentTool, setAlignmentTool] = useState<React.ComponentType<{}>>(
      () => <></>
    );
    useEffect(() => {
      const focusPlugin = createFocusPlugin({ theme: focusTheme });
      const resizeablePlugin = createResizeablePlugin();
      const alignmentPlugin = createAlignmentPlugin();
      const imagePlugin = createImagePlugin({
        decorator: composeDecorators(
          resizeablePlugin.decorator,
          alignmentPlugin.decorator,
          focusPlugin.decorator
        ),
      });
      const novaObjectsPlugin = createNovaObjectsPlugin({
        setContextMenuEntityProps,
        decorator: {
          card: composeDecorators(
            alignmentPlugin.decorator,
            focusPlugin.decorator
          ),
          explorerTable: composeDecorators(focusPlugin.decorator),
        },
      });
      setAlignmentTool(alignmentPlugin.AlignmentTool);
      setPlugins([
        focusPlugin,
        alignmentPlugin,
        resizeablePlugin,
        imagePlugin,
        novaObjectsPlugin,
      ]);
    }, []);

    const blockRenderMap = {
      alignRight: {
        element: "div",
      },
      alignLeft: {
        element: "div",
      },
      alignCenter: {
        element: "div",
      },
    };

    // Include 'paragraph' as a valid block and updated the unstyled element but
    // keep support for other draft default block types
    const extendedBlockRenderMap =
      DefaultDraftBlockRenderMap.merge(blockRenderMap);

    const myBlockStyleFn = (contentBlock) => {
      const type = contentBlock.getType();
      if (type === "alignRight") {
        return styles.alignRight;
      }
      if (type === "alignLeft") {
        return styles.alignLeft;
      }
      if (type === "alignCenter") {
        return styles.alignCenter;
      }
      return "";
    };

    const handleKeyCommand = useCallback(
      (command: string, state: EditorState) => {
        if (command === "backspace-to-start-page") {
          deleteFn?.();
          if (pageNum !== undefined) {
            const previousPage = documentState?.[pageNum - 1];
            if (previousPage) {
              const newState = EditorState.moveFocusToEnd(previousPage);
              onChange?.(newState, pageNum - 1);
            }
          }
          return "handled";
        }
        if (command === "delete-to-end-page") {
          if (pageNum !== undefined) {
            deleteFn?.(pageNum + 1);
          }
          return "handled";
        }
        if (command === "delete-to-last-block") {
          const contentState = editorState.getCurrentContent();
          const lastBlockKey = contentState.getLastBlock().getKey();
          const removeSelection = new SelectionState({
            anchorKey: contentState.getBlockBefore(lastBlockKey)?.getKey(),
            anchorOffset: contentState
              .getBlockBefore(lastBlockKey)
              ?.getLength(),
            focusKey: lastBlockKey,
            focusOffset: 0,
          });
          const newContentState = Modifier.removeRange(
            contentState,
            removeSelection,
            "forward"
          );
          onChange?.(
            EditorState.push(editorState, newContentState, "split-block-page")
          );
          return "handled";
        }
        const newState = RichUtils.handleKeyCommand(state, command);
        if (newState) {
          onChange?.(newState);
          return "handled";
        }
        return "not-handled";
      },
      [editorState, setEditorState]
    );

    const mapKeyToEditorCommand = useCallback(
      (e: React.KeyboardEvent) => {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const nextContentState =
          pageNum !== undefined
            ? documentState?.[pageNum + 1]?.getCurrentContent()
            : undefined;
        switch (e.code) {
          case "Tab": {
            changeDepth?.(e);
            return null;
          }
          case "Backspace": {
            if (!contentState.hasText()) {
              return "backspace-to-start-page";
            }
            break;
          }
          case "Delete": {
            if (
              // La page suivante est vide
              nextContentState &&
              !nextContentState.hasText() &&
              // La sélection n'est pas une range
              selectionState.isCollapsed() &&
              // Le curseur est à la fin de la page
              contentState.getLastBlock().getKey() ===
                selectionState.getAnchorKey() &&
              selectionState.getFocusOffset() ===
                contentState.getLastBlock().getLength()
            ) {
              return "delete-to-end-page";
            }
            if (
              // La page suivante n'est pas vide
              nextContentState &&
              nextContentState.hasText() &&
              // La sélection n'est pas une range
              selectionState.isCollapsed() &&
              // Le curseur est à la fin de la page
              contentState.getLastBlock().getKey() ===
                selectionState.getAnchorKey() &&
              // Le dernier block est vide
              contentState.getLastBlock().getLength() === 0
            ) {
              return "delete-to-last-block";
            }
            break;
          }
          default:
            break;
        }
        return getDefaultKeyBinding(e);
      },
      [editorState, setEditorState]
    );

    return (
      <>
        {plugins ? (
          <div className={styles.singleEditorContainer}>
            <>
              <Editor
                ref={(el) => {
                  // @ts-ignore
                  ref?.(el?.getEditorRef());
                }}
                readOnly={readOnly}
                customStyleMap={styleMap}
                editorState={editorState}
                onChange={onChange}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={mapKeyToEditorCommand}
                blockRenderMap={extendedBlockRenderMap}
                blockStyleFn={myBlockStyleFn}
                spellCheck={spellCheck}
                onFocus={() => onFocus?.()}
                plugins={plugins}
              />
              {AlignmentTool}
            </>
          </div>
        ) : (
          <IconLoader fill="#3083f7" width="100%" />
        )}
      </>
    );
  }
);

EditorSinglePage.defaultProps = defaultProps;

export default EditorSinglePage;
