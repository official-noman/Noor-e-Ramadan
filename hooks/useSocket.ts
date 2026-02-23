'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ServerTimeData } from '@/types';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverData, setServerData] = useState<ServerTimeData | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL;

    if (!SOCKET_URL) {
      console.error("❌ NEXT_PUBLIC_SOCKET_URL not set");
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to:', SOCKET_URL);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error.message);
      reconnectAttempts.current++;
    });

    socketInstance.on('server-time', (data: ServerTimeData) => {
      setServerData(data);
    });

    socketInstance.on('active-users', (data: any) => {
      if (typeof data === 'object' && data.count !== undefined) {
        setActiveUsers(data.count);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  const setLocation = (divisionKey: string) => {
    if (socket) {
      socket.emit('set-location', { division: divisionKey });
    }
  };

  return {
    socket,
    isConnected,
    serverData,
    activeUsers,
    setLocation,
  };
}