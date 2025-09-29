import paho.mqtt.client as mqtt
import time
import json
import uuid

# --- Configuration ---
MQTT_BROKER = "broker.emqx.io" 
MQTT_PORT = 1883
TOPIC_BASE = "smart_home/v1" 

# --- Device Class ---

class SmartDevice:
    def __init__(self, device_id, device_type, initial_state):
        self.id = device_id
        self.type = device_type
        self.state = initial_state 
        self.client_id = f"{device_type}-{device_id}-{uuid.uuid4().hex[:6]}"
        
        # Paho MQTT Client setup
        # FIX: Specify CallbackAPIVersion.VERSION2 to silence the DeprecationWarning
        self.client = mqtt.Client(
            client_id=self.client_id, 
            protocol=mqtt.MQTTv5,
            callback_api_version=mqtt.CallbackAPIVersion.VERSION2
        )
        
        # Set callback handlers
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        
        self.command_topic = f"{TOPIC_BASE}/{self.type}/{self.id}/command"
        self.status_topic = f"{TOPIC_BASE}/{self.type}/{self.id}/status"

    def _on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            print(f"[{self.id}] ✅ Connected. Subscribing to: {self.command_topic}")
            client.subscribe(self.command_topic, qos=1)
            self.publish_status() 
        else:
            print(f"[{self.id}] ❌ Connection failed, return code {rc}")

    def _on_message(self, client, userdata, msg):
        """Processes incoming command messages from the controller/frontend."""
        try:
            command = json.loads(msg.payload.decode())
            print(f"[{self.id}] Command received: {command}")

            # --- Device-specific logic to update internal state ---
            if self.type == "light":
                if command.get("action") == "set_state":
                    new_state = command.get("value")
                    if new_state in ["on", "off"]:
                        self.state['state'] = new_state
                        # If turning on, set default brightness
                        self.state['brightness'] = 80 if new_state == "on" else 0 
                        self.publish_status()
                elif command.get("action") == "set_brightness":
                    brightness = int(command.get("value"))
                    if 0 <= brightness <= 100:
                        self.state['brightness'] = brightness
                        self.state['state'] = "on" if brightness > 0 else "off"
                        self.publish_status()

            elif self.type == "fan":
                if command.get("action") == "set_speed":
                    new_speed = int(command.get("value"))
                    if 0 <= new_speed <= 5: # Max speed 5 based on your UI
                        self.state['speed'] = new_speed
                        self.state['state'] = "running" if new_speed > 0 else "off"
                        self.publish_status()

        except json.JSONDecodeError:
            print(f"[{self.id}] Failed to decode JSON payload.")
        except Exception as e:
            print(f"[{self.id}] Error processing command: {e}")


    def publish_status(self):
        """Publishes the current status to the broker."""
        status_payload = self.state.copy()
        status_payload['id'] = self.id
        status_payload['type'] = self.type
        status_payload['last_updated'] = time.time()
        
        self.client.publish(self.status_topic, json.dumps(status_payload), qos=1, retain=True)
        print(f"[{self.id}] >> Status published: {status_payload}")

    def start(self):
        """Connect to the broker and start the network loop."""
        try:
            self.client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
            self.client.loop_start() 
        except Exception as e:
            print(f"[{self.id}] Could not connect to broker: {e}")

    def stop(self):
        """Stop the network loop and disconnect."""
        self.client.loop_stop()
        self.client.disconnect()
        print(f"[{self.id}] Disconnected.")

def run_simulation():
    # Define your initial set of smart devices with the UI-specific IDs
    devices = [
        SmartDevice("living_room_light", "light", {'state': 'off', 'brightness': 0}),
        SmartDevice("bedroom_fan", "fan", {'speed': 0, 'mode': 'off'}),
    ]

    for device in devices:
        device.start()

    try:
        print("\n--- Device Simulation Running ---")
        print("Living Room Light ID: living_room_light")
        print("Bedroom Fan ID: bedroom_fan")
        print("Press Ctrl+C to stop all devices.")
        while True:
            time.sleep(1) 

    except KeyboardInterrupt:
        print("\nStopping all devices...")
    finally:
        for device in devices:
            device.stop()

if __name__ == "__main__":
    run_simulation()