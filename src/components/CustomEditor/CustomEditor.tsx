/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState, useEffect, useRef, Fragment } from "react";
import { toast } from "react-toastify";
import {
  EditorState,
  RichUtils,
  Modifier,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
  SelectionState,
} from "draft-js";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import cx from "classnames";

import ApiFactory from "../../API/controllers/api-factory";
import ObjectsApi from "../../API/controllers/object-api";
import { NovaEntityType } from "../../API/DataModels/Database/NovaEntityEnum";
import { useSocketContext } from "../../hooks/useSocket";
import useDocumentSocket from "../../hooks/useDocumentSocket";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectCase } from "../../store/case";
import { selectDocument, setSelection } from "../../store/document";
import { styleMap } from "../../constants/editor";
import { SESSION_STORAGE_KEYS } from "../../constants/storage-keys";
import { extractHtml } from "../../utils/general";
import {
  editorStatesToJson,
  editorStatesFromJson,
  cut,
  copy,
  paste,
} from "../../utils/editor";

import pluginAddImage from "../../components/CustomEditor/plugins/image/modifiers/addImage";
import createNovaObjectsPlugin from "../../components/CustomEditor/plugins/novaObjects";
import EditorSinglePage from "../../components/CustomEditor/EditorSinglePage";
import EditorToolbar from "../../components/CustomEditor/Toolbar/EditorToolbar";
import EditorContextMenu from "../../components/CustomEditor/ContextMenu/EditorContextMenu";
import PreviewDocumentDrawer from "../../components/Drawer/PreviewDocumentDrawer";

import commons from "@stevenorcun/common-css-lib/src/assets/scss/_commons.scss";
import styles from "./styles.scss";

interface CustomEditorProps {
  docId?: string;
}

const CustomEditor = ({ docId }: CustomEditorProps) => {
  const editorRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const caseState = useAppSelector(selectCase);
  const docuState = useAppSelector(selectDocument);
  const [isCollapsedPreview, setIsCollapsedPreview] = useState(true);
  const [doc, setDocument] = useState<any>(undefined);
  const [saved, setSaved] = useState(true);
  const [saveDate, setSaveDate] = useState<Date | undefined>(undefined);
  const [autosave] = useState(false);
  const [autoSaveIntervalId, setAutoSaveIntervalId] = useState<any>(undefined);
  const [spellCheck, setSpellCheck] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [isOpenedContextMenu, setIsOpenedContextMenu] = useState(false);
  const [contextMenuEntityProps, setContextMenuEntityProps] =
    useState<any>(undefined);

  const apiClient = ApiFactory.create<ObjectsApi>("ObjectsApi");
  const socket = useSocketContext();
  const novaObjectsPlugin = createNovaObjectsPlugin({
    setContextMenuEntityProps,
  });
  const decorator = new CompositeDecorator(novaObjectsPlugin.draftDecorators);

  // Set editor state from localStorage or empty
  const _DocumentStateRaw = localStorage.getItem("customDocumentState");
  const _caseId = caseState.currentCase?.id;
  let _documentState;
  if (_DocumentStateRaw && _caseId) {
    _documentState = JSON.parse(_DocumentStateRaw)[_caseId];
  }
  let _editorContents = editorStatesFromJson(_DocumentStateRaw || "", _caseId);
  const [zoom, setZoom] = useState(
    _documentState?.zoom ? _documentState?.zoom : 1
  );
  const {
    documentRef,
    focusPageIndex,
    setFocusPageIndex,
    editorStates,
    dispatchStates,
    addPage,
    removePage,
    onlineUsers,
    toggleHighlightUsers,
  } = useDocumentSocket(_editorContents, { docId, decorator, zoom });

  // Set editor state from api
  let _document;
  // let _editorContent;
  if (docId) {
    _document = apiClient.getObject(docId);
    setDocument(_document);
    if (_document?._source?.content) {
      _editorContents = _document?._source?.content?.map((_parsedContent) =>
        convertFromRaw(_parsedContent)
      );
    }
  }

  const myId = sessionStorage.getItem(SESSION_STORAGE_KEYS.userId);

  /**
   * Save the current editor content state
   */
  const onSave = () => {
    if (!caseState.currentCase) {
      return;
    }
    const caseId = caseState.currentCase.id;
    const documentState = editorStatesToJson(editorStates, zoom);
    // Save in localStorage
    let content;
    const documentStateRaw = localStorage.getItem("customDocumentState");
    if (documentStateRaw) {
      content = JSON.parse(documentStateRaw);
      content[caseId] = documentState;
    } else {
      content = {
        [caseId]: documentState,
      };
    }
    localStorage.setItem("customDocumentState", JSON.stringify(content));

    if (docId && doc) {
      const updatedDocument = { ...doc };
      updatedDocument._source.content = documentState.editorContents;
      updatedDocument._source.zoom = zoom;
      apiClient.updateObject(updatedDocument);
    } else {
      apiClient.createObject({
        type: NovaEntityType.WrittenDocument,
        caseId,
        content: documentState.editorContents,
        zoom,
      });
    }
    setSaved(true);
    setSaveDate(new Date());
    toast.success("Document sauvegardé");
  };

  /**
   * Change the editor's state
   * @param state Editor state with the current changes
   * @param editorIndex Document page index
   */
  const onChange = (state, editorIndex = focusPageIndex) => {
    dispatchStates({ index: editorIndex, payload: state });
    setSaved(false);
    // save current selection
    const selection = state.getSelection(); // refers to most up to date selection and save it
    // save current selection in store
    const selectionData = {
      pageIndex: editorIndex,
      anchorKey: selection.getAnchorKey(),
      anchorOffset: selection.getAnchorOffset(),
      focusKey: selection.getFocusKey(),
      focusOffset: selection.getFocusOffset(),
    };
    dispatch(setSelection(selectionData));

    const currentContent = editorStates[editorIndex].state.getCurrentContent();
    const newContent = state.getCurrentContent();
    // Change in content (not in selection)
    const isContentChange = currentContent !== newContent;

    let eState = state;
    // Remove highlight to unselect in other people view
    eState = toggleHighlightUsers(eState, editorIndex);

    // DETECTING CURSOR VERSUS HIGHLIGHT:
    // if your cursor is only in one spot and not highlighting anything then this is not a highlight
    if (selection.getStartOffset() === selection.getEndOffset()) {
      const windowSelection = window.getSelection();
      if (windowSelection && windowSelection.rangeCount > 0) {
        const range = windowSelection.getRangeAt(0);
        const nodeStartContainer = range.startContainer;
        let clientRects = range.getClientRects();
        clientRects =
          clientRects.length > 0
            ? clientRects
            : // @ts-ignore
              nodeStartContainer.getClientRects();
        if (clientRects.length > 0) {
          // cursor will always be a single range so you can just get the first range in the array
          const rects = clientRects[0];
          const { top, left, bottom } = rects;
          // Left margin of the document
          let documentMarginLeftStyle;
          if (documentRef?.current) {
            documentMarginLeftStyle =
              documentRef?.current?.currentStyle?.marginLeft ||
              window.getComputedStyle(documentRef?.current)?.marginLeft;
          }
          let documentMarginLeft = documentMarginLeftStyle
            ? parseInt(documentMarginLeftStyle, 10)
            : 0;
          documentMarginLeft = documentMarginLeft || 0;
          // Scroll position
          const scrollTop = editorRef?.current?.scrollTop;
          const scrollLeft = editorRef?.current?.scrollLeft;
          const loc = {
            top: top + scrollTop,
            bottom: bottom + scrollTop,
            left: left + scrollLeft - documentMarginLeft,
          };
          const data = {
            incomingSelectionObj: selection,
            loc,
            id: myId,
            editorIndex,
          };
          socket.emit("document/cursorMove", data);
        }
      }
    } else {
      socket.emit("document/cursorMove", {
        incomingSelectionObj: selection,
        id: myId,
        editorIndex,
      });
    }

    if (isContentChange) {
      const currentContentRaw = convertToRaw(eState.getCurrentContent());
      socket.emit("document/newContent", {
        content: JSON.stringify(currentContentRaw),
        id: myId,
        editorIndex,
      });
    }
  };

  /**
   * Activate auto save (save every 30s)
   */
  const autoSave = () => {
    if (!autosave) {
      if (autoSaveIntervalId) {
        clearInterval(autoSaveIntervalId);
        setAutoSaveIntervalId(undefined);
      }
      return;
    }
    const id = setInterval(onSave, 30000);
    setAutoSaveIntervalId(id);
  };

  const onZoom = (value) => {
    setZoom(value);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setIsOpenedContextMenu(true);
  };

  const handleContextMenuOut = (e) => {
    const entityElements = document.querySelectorAll("[data-contextmenu]");
    if (!Array.from(entityElements).some((el) => el.contains(e.target))) {
      setContextMenuEntityProps(undefined);
    }
  };

  const toggleSpellCheck = () => {
    setSpellCheck(!spellCheck);
  };

  // USED FOR BOLD, ITALIC, UNDERLINED
  const toggleInlineStyle = (inlineStyle) => {
    const editorState = editorStates[focusPageIndex].state;
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const removeAllInlineStyle = () => {
    const editorState = editorStates[focusPageIndex].state;
    const allStyles = editorState.getCurrentInlineStyle().toArray();
    let contentState;
    // eslint-disable-next-line no-restricted-syntax
    for (const style of allStyles) {
      contentState = Modifier.removeInlineStyle(
        contentState || editorState.getCurrentContent(),
        editorState.getSelection(),
        style
      );
    }
    onChange(
      EditorState.push(
        editorState,
        contentState || editorState.getCurrentContent(),
        "change-inline-style"
      )
    );
  };

  /**
   * Change the value of an inline style applied on the selection
   * @param style Value of style to apply
   * @param regex Regular expression used to recognize the inline style type
   * @param getStyle Given a style key, return the style value associated
   * @param getStyleMapKey Given a style value, return the style key associated
   * @example
   * colors = {"FONT-COLOR-red": 'red', "FONT-COLOR-blue": 'blue'}
   * // Change font color to blue
   * changeInlineStyle(
   *   'blue',
   *   new RegExp('FONT-COLOR-.*', 'g'),
   *   (key) => colors[key],
   *   (style) => `FONT-COLOR-${(style).toString()}`,
   * );
   */
  const changeInlineStyle = (
    style: any,
    regex: RegExp,
    getStyle: (key: string) => any,
    getStyleMapKey: (style: any) => string
  ) => {
    const editorState = editorStates[focusPageIndex].state;
    const previousStyleKey = editorState
      .getCurrentInlineStyle()
      .findLast((v, key) => regex.test(key));
    let previousStyle;
    if (previousStyleKey) {
      previousStyle = getStyle(previousStyleKey);
    }
    let contentState;
    if (previousStyle) {
      contentState = Modifier.removeInlineStyle(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        getStyleMapKey(previousStyle)
      );
    }
    contentState = Modifier.applyInlineStyle(
      contentState || editorState.getCurrentContent(),
      editorState.getSelection(),
      getStyleMapKey(style)
    );
    const newState = EditorState.push(
      editorState,
      contentState,
      "change-inline-style"
    );
    onChange(newState);
    return newState;
  };

  const onFontColorChange = (fontColor: string) => {
    changeInlineStyle(
      fontColor,
      new RegExp("FONT-COLOR-.*", "g"),
      (key) => styleMap[key].color,
      (style) => `FONT-COLOR-${style.toString()}`
    );
  };

  const onFontSizeChange = (fontSize: number) => {
    changeInlineStyle(
      fontSize,
      /FONT-SIZE-\d*/g,
      (key) => {
        const previousFontSize = styleMap[key].fontSize;
        return parseInt(
          previousFontSize.slice(0, previousFontSize.indexOf("p")),
          10
        );
      },
      (style) => `FONT-SIZE-${style.toString()}`
    );
    // focus(focusPageIndex, state);
  };

  const onHighlightColorChange = (color) => {
    changeInlineStyle(
      color,
      new RegExp("HIGHLIGHT-COLOR-.*", "g"),
      (key) => styleMap[key].backgroundColor,
      (style) => `HIGHLIGHT-COLOR-${style.toString()}`
    );
  };

  // USED FOR: unorderedlist, orderedlist
  const toggleBlockType = (blockType) => {
    const editorState = editorStates[focusPageIndex].state;
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  // TODO: don't work in multipage context
  const undo = () => {
    const editorState = editorStates[focusPageIndex].state;
    onChange(EditorState.undo(editorState));
  };

  // TODO: don't work in multipage context
  const redo = () => {
    const editorState = editorStates[focusPageIndex].state;
    onChange(EditorState.redo(editorState));
  };

  const changeDepth = (e: React.SyntheticEvent) => {
    const editorState = editorStates[focusPageIndex].state;
    const maxDepth = 8;
    const newEditorState = RichUtils.onTab(e, editorState, maxDepth);
    if (newEditorState !== editorState) {
      onChange(newEditorState);
    }
  };

  const exportToPdf = () => {
    const docu = new jsPDF({
      orientation: "p",
      hotfixes: ["px_scaling"],
    });

    docu.html(documentRef.current, {
      callback: (d) => {
        d.save("file.pdf");
      },
      windowWidth: documentRef.current?.clientWidth,
      width: 200, // width + margin left + margin right = 210mm = a4 format
      margin: 5,
    });
  };
  const exportToHtml = () => {
    const html = extractHtml(
      documentRef.current,
      [
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;300;400;600;700;800;900&display=swap" rel="stylesheet"></link>',
        "<style>.public-DraftEditor-content {padding: 10px;}</style>",
        "<style>body {overflow-y: auto !important;}</style>",
      ],
      true
    );
    const blob = new Blob(html, { type: "text/html" });
    saveAs(
      blob,
      caseState.currentCase?.label
        ? `${caseState.currentCase?.label}_report.html`
        : "file.html"
    );
  };
  const exportToJson = () => {
    const states = editorStatesToJson(editorStates, zoom);
    const json = JSON.stringify(states);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(
      blob,
      caseState.currentCase?.label
        ? `${caseState.currentCase?.label}_template.json`
        : "template.json"
    );
  };

  const importFromJson = (jsonString: string) => {
    const states = editorStatesFromJson(jsonString, _caseId);
    if (states) {
      dispatchStates({ type: "set", payload: states });
    }
  };

  /**
   * Add selected text to clipboard and remove it from editor
   */
  const cutText = () => {
    const editorState = editorStates[focusPageIndex].state;
    cut(editorState, onChange, () => {
      setIsOpenedContextMenu(false);
    });
  };

  /**
   * Add selected text to clipboard
   */
  const copyText = () => {
    const editorState = editorStates[focusPageIndex].state;
    copy(editorState, () => {
      setIsOpenedContextMenu(false);
    });
  };

  /**
   * Replace selected text with text saved in clipboard
   */
  const pasteText = () => {
    const editorState = editorStates[focusPageIndex].state;
    paste(editorState, onChange, () => {
      setIsOpenedContextMenu(false);
    });
  };

  const addImage = async (image) => {
    const editorState = editorStates[focusPageIndex].state;
    const newEditorState = await pluginAddImage(image, editorState);
    onChange(newEditorState);
  };

  const getSelectionFromStore = (state?: EditorState) => {
    try {
      if (editorStates && docuState?.selection) {
        const es = state || editorStates[docuState.selection.pageIndex].state;
        const contentState = es.getCurrentContent();
        const startBlock = contentState.getBlockForKey(
          docuState.selection.anchorKey
        );
        const endBlock = contentState.getBlockForKey(
          docuState.selection.focusKey
        );
        if (!startBlock || !endBlock) {
          return undefined;
        }
        const newSelection = new SelectionState({
          anchorKey: docuState?.selection.anchorKey,
          anchorOffset: docuState?.selection.anchorOffset,
          focusKey: docuState?.selection.focusKey,
          focusOffset: docuState?.selection.focusOffset,
        });
        const newState = EditorState.forceSelection(es, newSelection);
        if (newState) {
          dispatchStates({
            index: docuState.selection.pageIndex,
            payload: newState,
          });
          setFocusPageIndex(docuState.selection.pageIndex);
        }
        return {
          pageIndex: docuState.selection.pageIndex,
          state: newState,
        };
      }
      return undefined;
    } catch (error: any) {
      toast.error(error);
      return undefined;
    }
  };

  // const focus = (index = focusPageIndex, state?) => {
  //   focusPage(index);
  //   getSelectionFromStore(state);
  // };

  const insertDraftEntityDroped = (
    key: string,
    editorState: EditorState,
    pageIndex: number,
    addEntity: (
      entity: any,
      contentState: ContentState,
      editorState?: EditorState
    ) => ContentState
  ) => {
    const data = localStorage.getItem(key);
    if (data) {
      const content = JSON.parse(data);
      let contentState = editorState.getCurrentContent();
      // eslint-disable-next-line no-restricted-syntax
      for (const entity of content) {
        contentState = addEntity(entity, contentState, editorState);
      }
      onChange(
        EditorState.push(editorState, contentState, "apply-entity"),
        pageIndex
      );
      localStorage.removeItem(key);
    }
  };

  const insertEntityDroped = (editorState, pageIndex) => {
    insertDraftEntityDroped(
      "note-insertedEntities",
      editorState,
      pageIndex,
      novaObjectsPlugin.addCard
    );
  };

  const insertExplorerDroped = (editorState, pageIndex) => {
    insertDraftEntityDroped(
      "note-insertedExplorer",
      editorState,
      pageIndex,
      novaObjectsPlugin.addExplorerTable
    );
  };

  useEffect(() => {
    autoSave();
    const res = getSelectionFromStore();
    insertEntityDroped(
      res?.state || editorStates[focusPageIndex].state,
      res?.pageIndex || focusPageIndex
    );
    insertExplorerDroped(
      res?.state || editorStates[focusPageIndex].state,
      res?.pageIndex || focusPageIndex
    );
  }, []);

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenuOut);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenuOut);
    };
  }, []);

  const onFocus = (index: number) => {
    setFocusPageIndex(index);
  };

  return (
    <div>
      <div className={styles.docContainer}>
        <EditorToolbar
          editorState={editorStates[focusPageIndex].state}
          spellCheck={spellCheck}
          zoom={zoom}
          onlineUsers={onlineUsers}
          saved={saved}
          saveDate={saveDate}
          onToggle={toggleInlineStyle}
          onFontColorClick={(fontColor: string) => onFontColorChange(fontColor)}
          onHighlightColorChange={(color: string) =>
            onHighlightColorChange(color)
          }
          onFontSizeChange={(fontSize: number) => onFontSizeChange(fontSize)}
          onChangeBlockType={toggleBlockType}
          onUndo={undo}
          onRedo={redo}
          onToggleSpellCheck={toggleSpellCheck}
          onUnstyle={removeAllInlineStyle}
          onChangeDepth={changeDepth}
          onAddImage={addImage}
          onZoom={onZoom}
          onExportPdf={exportToPdf}
          onExportHtml={exportToHtml}
          onExportJson={exportToJson}
          onImportJson={importFromJson}
          onSave={onSave}
          cutText={cutText}
          copyText={copyText}
          pasteText={pasteText}
        />
        <div className={styles.documentContainer}>
          <PreviewDocumentDrawer
            className={styles.documentPreview}
            isCollapsed={isCollapsedPreview}
            onToggle={() => setIsCollapsedPreview(!isCollapsedPreview)}
            editorStates={editorStates.map((state) => state.state)}
            addPage={addPage}
          />
          <div
            ref={editorRef}
            className={cx(styles.editor, commons.PrettyScroll)}
          >
            <div
              className={styles.editorContainer}
              style={{
                transform: `translateY(${(zoom - 1) * 50}%) scale(${zoom})`,
              }}
            >
              <div
                className={styles.editorDocument}
                onContextMenu={onContextMenu}
                ref={documentRef}
              >
                {onlineUsers.map((user) => (
                  <Fragment key={user.id}>
                    {user?.cursor && (
                      <div
                        style={{
                          position: "absolute",
                          backgroundColor: user.color,
                          width: "2px",
                          height: user.cursor.height,
                          top: user.cursor.top,
                          left: user.cursor.left,
                          zIndex: 3,
                        }}
                      />
                    )}
                  </Fragment>
                ))}
                {editorStates.map((state, index) => (
                  <EditorSinglePage
                    key={index}
                    ref={(elem) => {
                      state.ref = elem;
                    }}
                    editorState={state.state}
                    setEditorState={(s) =>
                      dispatchStates({ index, payload: s })
                    }
                    onChange={(s, i = index) => onChange(s, i)}
                    documentState={editorStates.map((s) => s.state)}
                    pageNum={index}
                    spellCheck={spellCheck}
                    setContextMenuEntityProps={setContextMenuEntityProps}
                    changeDepth={changeDepth}
                    onFocus={(i = index) => onFocus(i)}
                    deleteFn={(i = index) => removePage(i)}
                  />
                ))}
              </div>
              <EditorContextMenu
                editorState={editorStates[focusPageIndex].state}
                editorChange={onChange}
                isOpen={isOpenedContextMenu}
                setIsOpen={setIsOpenedContextMenu}
                menuPosition={contextMenuPosition}
                entityProps={contextMenuEntityProps}
                cutText={cutText}
                copyText={copyText}
                pasteText={pasteText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomEditor;
