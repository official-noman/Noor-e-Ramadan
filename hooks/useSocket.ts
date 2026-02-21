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
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      reconnectAttempts.current++;
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    // Listen for server time updates
    socketInstance.on('server-time', (data: ServerTimeData) => {
      setServerData(data);
    });

    // Listen for active users updates
    socketInstance.on('active-users', (count: number) => {
      setActiveUsers(count);
    });

    // Keep-alive ping
    const pingInterval = setInterval(() => {
      if (socketInstance.connected) {
        socketInstance.emit('ping');
      }
    }, 30000); // Ping every 30 seconds

    setSocket(socketInstance);

    return () => {
      clearInterval(pingInterval);
      socketInstance.close();
    };
  }, []);

  return {
    socket,
    isConnected,
    serverData,
    activeUsers,
  };
}
