import { Droplet, Cloud, Thermometer } from "lucide-react"; // Ikon dari lucide-react
import { motion } from "framer-motion";
import Action from "./Action";
import mqttClient from "../../mqttClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [soilMoisture, _setSoilMoisture] = useState(10); // Misalnya kelembaban tanah mulai dari 10%

  useEffect(() => {
    mqttClient.on("message", (topic, payload) => {
      if (topic === "suhu") {
        setTemperature(parseFloat(payload.toString()));
      } else if (topic === "kelembaban") {
        setHumidity(parseFloat(payload.toString()));
      }
    });
  }, []);

  return (
    <>
      <Action />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 ">
        {/* Kelembaban Tanah */}
        <div className="p-4 border rounded-md border-zinc-700 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Droplet className="w-6 h-6 text-zinc-500" />
              <p className="text-sm">Kelembaban Tanah</p>
            </div>
            <p className="text-sm">{soilMoisture}%</p>
          </div>
          <div className="relative h-4 w-full border border-zinc-700 rounded-md mt-2">
            <motion.div initial={{ width: "0%" }} animate={{ width: `${soilMoisture}%` }} className="absolute inset-0 bg-zinc-300 rounded-md" />
          </div>
        </div>

        {/* Kelembaban Udara */}
        <div className="p-4 border rounded-md border-zinc-700 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-zinc-500" />
              <p className="text-sm">Kelembaban Udara</p>
            </div>
            <p className="text-sm">{humidity}%</p>
          </div>
          <div className="relative h-4 w-full border border-zinc-700 rounded-md mt-2">
            <motion.div initial={{ width: "0%" }} animate={{ width: `${humidity}%` }} className="absolute inset-0 bg-zinc-300 rounded-md" />
          </div>
        </div>

        {/* Suhu Udara */}
        <div className="p-4 border rounded-md border-zinc-700 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-zinc-500" />
              <p className="text-sm">Suhu Udara</p>
            </div>
            <p className="text-sm">{temperature}°C</p>
          </div>
          <div className="relative h-4 w-full border border-zinc-700 rounded-md mt-2">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${(temperature + 10) * 2}%` }} // Mengubah skala suhu menjadi lebih terlihat
              className="absolute inset-0 bg-zinc-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </>
  );
}
