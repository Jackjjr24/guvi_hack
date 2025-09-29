// FIX: We import the necessary classes and interfaces directly from paho-mqtt
// This ensures TypeScript knows exactly where to find the definitions for 
// Client, Message, ConnectionLost, and ErrorResponse structure.
import { Client, Message } from 'paho-mqtt';
import { DeviceState, CommandPayload } from '../types/deviceTypes';

// Define ErrorResponse type locally since it's not exported by paho-mqtt
type ErrorResponse = {
    errorCode: number;
    errorMessage: string;
};

// --- Configuration ---
const MQTT_BROKER = "broker.emqx.io";
const MQTT_WS_PORT = 8083;
const TOPIC_BASE = "smart_home/v1"; 

const STATUS_SUBSCRIPTION_TOPIC = `${TOPIC_BASE}/+/+/status`;

type MessageHandler = (deviceStatus: DeviceState) => void;

class MqttClient {
    // FIXED: Using the directly imported 'Client' class type
    private client: Client; 
    private messageHandler: MessageHandler | null = null;
    private isConnected: boolean = false;

    constructor() {
        const clientId = 'web-' + Math.random().toString(16).substr(2, 8);
        
        // FIXED: Paho.Client is now just Client due to direct import
        this.client = new Client(MQTT_BROKER, MQTT_WS_PORT, clientId);

        this.client.onConnectionLost = this.onConnectionLost;
        this.client.onMessageArrived = this.onMessageArrived;
    }

    public setMessageHandler(handler: MessageHandler) {
        this.messageHandler = handler;
    }

    public connect(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.isConnected) {
                console.log("MQTT client already connected.");
                return resolve(true);
            }

            // Using object type to avoid Paho.ConnectionOptions error
            const connectOptions: object = { 
                onSuccess: () => {
                    console.log("✅ MQTT Connected via WebSocket.");
                    this.client.subscribe(STATUS_SUBSCRIPTION_TOPIC, { qos: 1 });
                    console.log(`✅ Subscribed to: ${STATUS_SUBSCRIPTION_TOPIC}`);
                    this.isConnected = true;
                    resolve(true);
                },
                // FIXED: Using the directly imported 'ErrorResponse' type
                onFailure: (response: ErrorResponse) => { 
                    console.error(`❌ MQTT Connection failed: ${response.errorMessage}`);
                    this.isConnected = false;
                    resolve(false);
                },
                timeout: 5,
                useSSL: false,
            };

            console.log(`Connecting to MQTT broker at ws://${MQTT_BROKER}:${MQTT_WS_PORT}/mqtt...`);
            this.client.connect(connectOptions);
        });
    }

    // FIXED: Using 'any' type for the connection lost callback parameter
    private onConnectionLost = (response: any) => {
        this.isConnected = false;
        if (response.errorCode !== 0) {
            console.error(`❌ MQTT Connection Lost: ${response.errorMessage}`);
        }
    };

    // FIXED: Using the directly imported 'Message' type
    private onMessageArrived = (message: Message) => {
        try {
            // Use the payloadString() method to get the string payload
            const payloadString = typeof message.payloadString === 'function'
                ? message.payloadString()
                : (message as any).payloadString; 
            const deviceStatus: DeviceState = JSON.parse(payloadString);
            
            if (this.messageHandler) {
                this.messageHandler(deviceStatus);
            }

        } catch (error) {
            console.error("❌ Error parsing MQTT message payload:", error);
        }
    };

    /**
     * Publishes a command to a specific device.
     */
    public publishCommand(deviceId: string, deviceType: string, payload: CommandPayload) {
        if (!this.isConnected) {
            console.warn("MQTT client not connected. Command not sent.");
            return;
        }

        const commandTopic = `${TOPIC_BASE}/${deviceType}/${deviceId}/command`;
        // FIXED: Using the directly imported 'Message' class
        const message = new Message(JSON.stringify(payload)); 
        message.destinationName = commandTopic;
        message.qos = 1;
        
        this.client.send(message);
        console.log(`>> COMMAND SENT to ${commandTopic}: ${JSON.stringify(payload)}`);
    }

    public disconnect() {
        if (this.isConnected) {
            this.client.disconnect();
            this.isConnected = false;
            console.log("MQTT Disconnected.");
        }
    }
}

export const mqttClient = new MqttClient();