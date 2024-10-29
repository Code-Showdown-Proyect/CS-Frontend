export interface WebSocketContextProps {
    websocket: WebSocket | null;
    sendMessage: (message: string) => void;
}
