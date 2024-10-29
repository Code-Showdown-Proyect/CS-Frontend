// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
    websocket: WebSocket | null;
    sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    url: string;
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
    const [websocket, setWebSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            setWebSocket(null);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setWebSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(message);
        }
    };

    return (
        <WebSocketContext.Provider value={{ websocket, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};
