import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  EditorState,
  SelectionState,
  convertFromRaw,
  RichUtils,
} from 'draft-js';
import { useSocketContext } from '@/hooks/useSocket';
import { useDocumentState, DocumentStateOptions } from '@/hooks/useDocumentState';
import { useAppSelector } from '@/store/hooks';
import { selectToken } from '@/store/token';
import { selectCase } from '@/store/case';
import { USER_COLORS } from '@/constants/editor';
import { SESSION_STORAGE_KEYS } from '@/constants/storage-keys';

interface DocumentSocketConfig extends DocumentStateOptions {
  docId?: string;
}

export default function useDocSocket(initState?, config?: DocumentSocketConfig) {
  const documentRef = useRef<any>(null);
  const [userColor, setUserColor] = useState('black');
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [onlineUserJoined, setOnlineUserJoined] = useState<any>(undefined);
  const [onlineUserLeft, setOnlineUserLeft] = useState<any>(undefined);
  const [onlineUserCursorMoved, setOnlineUserCursorMoved] = useState<any>(undefined);
  const [onlineUserCursorSelection, setOnlineUserCursorSelection] = useState<any>(undefined);

  const documentState = useDocumentState(initState, { decorator: config?.decorator, zoom: config?.zoom });
  const {
    focusPageIndex,
    editorStates,
    dispatchStates,
  } = documentState;

  const caseState = useAppSelector(selectCase);
  const { token } = useAppSelector(selectToken);
  const socket = useSocketContext();

  const myId = sessionStorage.getItem(SESSION_STORAGE_KEYS.userId);

  const toggleHighlightUsers = (
    state: EditorState,
    editorIndex: number = focusPageIndex,
    users: any[] = onlineUsers,
  ): EditorState => {
    let eState = state;
    if (users?.length <= 1) {
      return eState;
    }
    const selection = eState.getSelection();
    // eslint-disable-next-line no-restricted-syntax
    for (const user of users) {
      const highlight = user?.selection?.highlightSelection;
      if (highlight && editorIndex === user?.selection?.editorIndex) {
        const eContentState = eState.getCurrentContent();
        const startBlock = eContentState.getBlockForKey(highlight.getAnchorKey());
        const endBlock = eContentState.getBlockForKey(highlight.getFocusKey());
        // Check if the selection always exist
        if (
          startBlock
          && endBlock
          && highlight.getAnchorOffset() <= startBlock.getLength()
          && highlight.getFocusOffset() <= endBlock.getLength()
        ) {
          eState = EditorState.acceptSelection(eState, highlight);
          eState = RichUtils.toggleInlineStyle(eState, `HIGHLIGHT-COLOR-${user.color}`);
          eState = EditorState.acceptSelection(eState, selection);
        }
      }
    }
    return eState;
  };

  // Socket handler
  const onWelcome = useCallback((data) => {
    if (data?.users) {
      const users = data.users.map((u, key) => {
        const color = USER_COLORS[key % USER_COLORS.length];
        if (u.user_id === myId) {
          setUserColor(color);
        }
        return {
          id: u.user_id,
          username: u.username,
          color,
        };
      });
      setOnlineUsers(users);
    }
  }, []);
  const onUserJoined = useCallback((data) => {
    if (!data?.user_id) {
      return;
    }
    const userId = data.user_id;
    setOnlineUserJoined({ id: userId, username: data.username });
  }, []);
  const onUserLeft = useCallback((data) => {
    if (!data?.user_id) {
      return;
    }
    const userId = data.user_id;
    setOnlineUserLeft({ id: userId });
  }, []);
  const onReceivedNewContent = (data) => {
    if (data.id === myId) {
      return;
    }
    const contentState = convertFromRaw(JSON.parse(data.content));
    const newEditorState = EditorState.createWithContent(contentState, config?.decorator);
    const state = toggleHighlightUsers(newEditorState, data.editorIndex || focusPageIndex);
    dispatchStates({ index: data.editorIndex || focusPageIndex, payload: state });
  };
  const onReceiveNewCursor = (data) => {
    if (data?.id === myId) {
      return;
    }
    if (data?.loc && data?.id) {
      setOnlineUserCursorMoved(data);
    }
    if (!data?.loc && data?.incomingSelectionObj) {
      setOnlineUserCursorSelection(data);
    }
  };

  // Collaborative features
  useEffect(() => {
    if (onlineUserJoined) {
      const findUser = onlineUsers.find((user: any) => user.id === onlineUserJoined.id);
      if (!findUser) {
        const color = USER_COLORS[onlineUsers.length % USER_COLORS.length];
        const user = { id: onlineUserJoined.id, username: onlineUserJoined.username, color };
        setOnlineUsers([...onlineUsers, user]);
      }
      setOnlineUserJoined(undefined);
    }
  }, [onlineUserJoined]);

  useEffect(() => {
    if (onlineUserLeft) {
      const filteredUsers = onlineUsers.filter((user: any) => user.id !== onlineUserLeft.id);
      setOnlineUsers([...filteredUsers]);
      setOnlineUserLeft(undefined);
    }
  }, [onlineUserLeft]);

  // Changes when cursor move
  useEffect(() => {
    if (onlineUserCursorMoved) {
      const findUserIndex = onlineUsers.findIndex((user) => user.id === onlineUserCursorMoved.id);
      if (findUserIndex !== -1) {
        const onlineUsersCopied = [...onlineUsers];
        const marginLeft = 100;
        const marginTop = 210; // Height of navbar (60) + toolbars (60 * 2) + padding (30);
        const documentMarginLeftStyle = documentRef?.current?.currentStyle?.marginLeft
          || window.getComputedStyle(documentRef?.current)?.marginLeft;
        let documentMarginLeft = documentMarginLeftStyle ? parseInt(documentMarginLeftStyle, 10) : 0;
        documentMarginLeft = documentMarginLeft || 0;
        onlineUsersCopied[findUserIndex].cursor = {
          top: onlineUserCursorMoved.loc.top - marginTop,
          left: onlineUserCursorMoved.loc.left - marginLeft + documentMarginLeft,
          height: onlineUserCursorMoved.loc.bottom - onlineUserCursorMoved.loc.top,
        };
        if (onlineUsersCopied[findUserIndex].selection) {
          // Set highlight
          const { editorIndex } = onlineUsersCopied[findUserIndex].selection;
          let { state } = editorStates[editorIndex];
          if (state) {
            state = toggleHighlightUsers(state, editorIndex);
            dispatchStates({ index: editorIndex, payload: state });
          }
          onlineUsersCopied[findUserIndex].selection = undefined;
        }
        setOnlineUsers(onlineUsersCopied);
      }
      setOnlineUserCursorMoved(undefined);
    }
  }, [onlineUserCursorMoved]);

  // Changes when other user select
  useEffect(() => {
    if (onlineUserCursorSelection) {
      const findUserIndex = onlineUsers.findIndex((user) => user.id === onlineUserCursorSelection.id);
      if (findUserIndex !== -1) {
        const onlineUsersCopied = [...onlineUsers];
        const highlightSelection = new SelectionState(onlineUserCursorSelection.incomingSelectionObj);
        const editorIndex = onlineUserCursorSelection.editorIndex !== undefined
          ? onlineUserCursorSelection.editorIndex
          : focusPageIndex;
        const eIndex = onlineUsersCopied[findUserIndex].selection?.editorIndex;
        let state = editorStates[editorIndex]?.state;
        // Remove previous selection
        let removeSelectionState = eIndex !== undefined ? editorStates[eIndex]?.state : undefined;
        // Set highlight
        if (removeSelectionState) {
          removeSelectionState = toggleHighlightUsers(removeSelectionState, eIndex, onlineUsersCopied);
          if (eIndex === editorIndex) {
            state = removeSelectionState;
          }
        }
        onlineUsersCopied[findUserIndex].selection = {
          highlightSelection,
          editorIndex,
        };
        // Set highlight
        if (state) {
          state = toggleHighlightUsers(state, editorIndex, onlineUsersCopied);
          if (!removeSelectionState || eIndex === editorIndex) {
            dispatchStates({ index: editorIndex, payload: state });
          } else {
            dispatchStates({ index: [editorIndex, eIndex], payload: [state, removeSelectionState] });
          }
        }
        // Remove cursor
        onlineUsersCopied[findUserIndex].cursor = undefined;
        setOnlineUsers(onlineUsersCopied);
      }
      setOnlineUserCursorSelection(undefined);
    }
  }, [onlineUserCursorSelection]);

  useEffect(() => {
    socket.emit('login', {
      token,
    });

    socket.emit('document/join', {
      document_id: config?.docId || caseState.currentCase?.id,
    });
  }, [token]);

  useEffect(() => {
    socket.on('welcome', onWelcome);
    socket.on('userjoined', onUserJoined);
    socket.on('userleft', onUserLeft);
    socket.on('receivedNewContent', onReceivedNewContent);
    socket.on('receiveNewCursor', onReceiveNewCursor);

    socket.emit('document/join', {
      document_id: config?.docId || caseState.currentCase?.id,
    });

    return () => {
      socket.emit('document/leave');
      socket.off('welcome', onWelcome);
      socket.off('userjoined', onUserJoined);
      socket.off('userleft', onUserLeft);
      socket.off('receivedNewContent', onReceivedNewContent);
      socket.off('receiveNewCursor', onReceiveNewCursor);
    };
  }, []);

  return {
    ...documentState,
    documentRef,
    userColor,
    setUserColor,
    onlineUsers,
    toggleHighlightUsers,
  };
}
