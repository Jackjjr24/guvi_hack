declare module 'paho-mqtt' {
    export class Client {
        constructor(host: string, port: number, clientId: string);
        connect(options: any): void;
        disconnect(): void;
        subscribe(topic: string, options?: any): void;
        unsubscribe(topic: string, options?: any): void;
        send(message: Message): void;
        onMessageArrived: (message: Message) => void;
        onConnectionLost: (responseObject: any) => void;
    }
    export class Message {
        constructor(payload: string);
        destinationName: string;
    }
}