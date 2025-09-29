import paho.mqtt.client as mqtt
import time
import json

# --- Configuration ---
MQTT_BROKER = "broker.emqx.io" # Must match the simulator
MQTT_PORT = 1883
CLIENT_ID = "SmartHomeConsoleController"
TOPIC_BASE = "smart_home/v1" 

# Subscribe to all status messages under the base topic
SUBSCRIPTION_TOPIC = f"{TOPIC_BASE}/+/+/status"

# --- Callbacks ---

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("✅ Controller Connected to MQTT Broker successfully.")
        client.subscribe(SUBSCRIPTION_TOPIC)
        print(f"✅ Subscribed to: {SUBSCRIPTION_TOPIC}")
    else:
        print(f"❌ Controller Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    """Callback when any device status is received."""
    try:
        topic = msg.topic
        # Payload is expected to be JSON from device_simulator.py
        device_status = json.loads(msg.payload.decode()) 
        
        # Topic components: TOPIC_BASE / type / id / status
        topic_parts = topic.split('/')
        device_type = topic_parts[2]
        device_id = topic_parts[3]

        print(f"\n<< STATUS UPDATE RECEIVED >>")
        print(f"Topic: {topic}")
        print(f"Device: {device_type.upper()} ({device_id})")
        print(f"Status: {json.dumps(device_status, indent=2)}")
        
    except json.JSONDecodeError:
        print(f"Received non-JSON message on {msg.topic}")
    except Exception as e:
        print(f"An error occurred: {e}")

# --- Command Function ---

def publish_command(client, device_id, device_type, command_payload):
    """Sends a command to a specific device."""
    # Command topic format: TOPIC_BASE / type / id / command
    command_topic = f"{TOPIC_BASE}/{device_type}/{device_id}/command"
    try:
        client.publish(command_topic, json.dumps(command_payload), qos=1)
        print(f"\n>> SENT COMMAND >>")
        print(f"Target: {device_type.upper()} ({device_id})")
        print(f"Command: {command_payload}")
    except Exception as e:
        print(f"Error publishing: {e}")

# backend/backend_controller.py

# ... (All functions remain the same) ...

def main():
    client = mqtt.Client(client_id=CLIENT_ID, protocol=mqtt.MQTTv5)
    client.on_connect = on_connect
    client.on_message = on_message
    
    print(f"Connecting to broker: {MQTT_BROKER}:{MQTT_PORT}")
    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    
    # Start background loop
    client.loop_start() 
    
    # Simple terminal command interface
    while True:
        try:
            print("\n-------------------------")
            print("--- Command Interface (New IDs) ---")
            print("1. Living Room Light ON (living_room_light)")
            print("2. Living Room Light OFF (living_room_light)")
            print("3. Bedroom Fan Speed 3 (bedroom_fan)")
            print("4. Bedroom Fan OFF (bedroom_fan)")
            print("Q. Quit")
            
            choice = input("Enter command number (or Q): ").strip().upper()
            
            if choice == '1':
                cmd = {"action": "set_state", "value": "on"}
                # Target the new ID
                publish_command(client, "living_room_light", "light", cmd) 
            elif choice == '2':
                cmd = {"action": "set_state", "value": "off"}
                # Target the new ID
                publish_command(client, "living_room_light", "light", cmd)
            elif choice == '3':
                cmd = {"action": "set_speed", "value": 3}
                # Target the new ID
                publish_command(client, "bedroom_fan", "fan", cmd)
            elif choice == '4':
                cmd = {"action": "set_speed", "value": 0}
                # Target the new ID
                publish_command(client, "bedroom_fan", "fan", cmd)
            elif choice == 'Q':
                break
            else:
                print("Invalid choice. Please try again.")

            time.sleep(0.5)

        except KeyboardInterrupt:
            break
            
    # ... (Rest of the function remains the same) ...

if __name__ == "__main__":
    main()

