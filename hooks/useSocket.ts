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
    // কারণ আপনার server.js ৩০০১ পোর্টে চলছে।
    // const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://127.0.0.1:8000';
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'], // শুধুমাত্র websocket দিলে কানেকশন সুপার ফাস্ট হয়
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to Socket Server at:', SOCKET_URL);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error.message);
      reconnectAttempts.current++;
    });

    // Listen for server time updates
    socketInstance.on('server-time', (data: ServerTimeData) => {
      setServerData(data);
    });

    // সংশোধন: server.js থেকে ডাটা আসে { count: number } আকারে
    socketInstance.on('active-users', (data: any) => {
      if (typeof data === 'object' && data.count !== undefined) {
        setActiveUsers(data.count);
      } else {
        setActiveUsers(data);
      }
    });

    setSocket(socketInstance);

    return () => {
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
