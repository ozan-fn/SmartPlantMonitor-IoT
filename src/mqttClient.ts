import mqtt from "mqtt";

const mqttClient = mqtt.connect("wss://a93bb6a45b2d4a60bbf254a374d0e89f.s1.eu.hivemq.cloud:8884/mqtt", {
  protocol: "wss",
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  username: "ozan6825", // Ganti dengan username Anda
  password: "Akhmad6825", // Ganti dengan password Anda
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe(["ping", "suhu", "kelembaban"]);
});

mqttClient.on("error", (error: Error) => {
  console.error("Connection failed:", error);
});

export default mqttClient;
