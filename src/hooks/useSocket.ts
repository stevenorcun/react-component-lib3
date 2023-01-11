import { createContext, useContext } from 'react';
import io from 'socket.io-client';

export const socket = io(process.env?.REACT_APP_API_URL || 'http://localhost', {
  path: '/ws/socket.io',
  reconnectionAttempts: 3,
  timeout: 2000,
}).connect();

export const SocketContext = createContext(socket);
export const useSocketContext = () => useContext(SocketContext);
