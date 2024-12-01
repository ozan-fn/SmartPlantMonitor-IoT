import { Droplet, Cloud, Thermometer } from "lucide-react"; // Ikon dari lucide-react
import { motion } from "framer-motion";
import Action from "./Action";
import mqttClient from "../../mqttClient";
import { useEffect, useState } from "react";

export default function Home() {
    const [humidity, setHumidity] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [soilMoisture, setSoilMoisture] = useState(0); // Misalnya kelembaban tanah mulai dari 10%

    useEffect(() => {
        const handleMQTTMessage = (topic: string, payload: Buffer) => {
            const message = parseFloat(payload.toString());
            if (topic === "suhu") {
                setTemperature(message);
            } else if (topic === "kelembaban") {
                setHumidity(message);
            } else if (topic === "kelembaban_tanah") {
                setSoilMoisture(message);
            }
        };

        mqttClient.on("message", handleMQTTMessage);

        return () => {
            mqttClient.off("message", handleMQTTMessage);
        };
    }, []);

    // Fungsi untuk menentukan warna indikator berdasarkan persentase dengan hex color
    const getIndicatorColor = (percentage: number) => {
        if (percentage < 30) return "#FF5A5A"; // Merah untuk kelembaban rendah
        if (percentage < 60) return "#FFDD57"; // Kuning untuk kelembaban sedang
        return "#4CAF50"; // Hijau untuk kelembaban tinggi
    };

    return (
        <>
            <Action />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-9 overflow-auto">
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
                        <motion.div initial={{ width: "0%" }} animate={{ width: `${soilMoisture}%`, backgroundColor: getIndicatorColor(soilMoisture) }} transition={{ duration: 2 }} style={{ backgroundColor: getIndicatorColor(soilMoisture) }} className="absolute inset-0 rounded-md" />
                    </div>
                    <p className="text-xs mt-1 text-zinc-400">{soilMoisture < 30 ? "Kelembaban rendah - Mesin penyiram otomatis akan aktif." : "Kelembaban tanah memadai."}</p>
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
                        <motion.div initial={{ width: "0%" }} animate={{ width: `${humidity}%`, backgroundColor: getIndicatorColor(humidity) }} transition={{ duration: 2 }} style={{ backgroundColor: getIndicatorColor(humidity) }} className="absolute inset-0 rounded-md" />
                    </div>
                    <p className="text-xs mt-1 text-zinc-400">{humidity < 30 ? "Kelembaban udara rendah, tingkatkan kelembaban." : humidity > 60 ? "Kelembaban tinggi, tetap monitor tanaman." : "Kelembaban udara normal."}</p>
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
                        <motion.div initial={{ width: "0%" }} animate={{ width: `${(temperature + 10) * 2}%`, backgroundColor: getIndicatorColor((temperature + 10) * 2) }} transition={{ duration: 2 }} style={{ backgroundColor: getIndicatorColor((temperature + 10) * 2) }} className="absolute inset-0 rounded-md" />
                    </div>
                    <p className="text-xs mt-1 text-zinc-400">{temperature < 15 ? "Suhu rendah, tanaman mungkin butuh suhu lebih hangat." : temperature > 30 ? "Suhu tinggi, perhatikan kebutuhan air tanaman." : "Suhu dalam kondisi optimal."}</p>
                </div>

                <div className="h-20 w-1" />
            </div>
        </>
    );
}
