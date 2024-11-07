import { GlassWater } from "lucide-react"; // Mengimpor ikon dari lucide-react
import mqttClient from "../../mqttClient";
import { useState } from "react";

export default function Action() {
  const [action, setAction] = useState(false);

  async function watering(n: string) {
    mqttClient.publish("watering", n);
    setAction(true);
    setTimeout(() => setAction(false), +n * 1000);
  }

  return (
    <div className="flex flex-row gap-4">
      {/* Tombol untuk Siram 1 detik */}
      <button disabled={action} onClick={() => watering("1")} className={`h-12 px-6 flex items-center gap-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 focus:outline-none ${action ? "opacity-50 cursor-not-allowed" : ""}`}>
        <GlassWater className="w-5 h-5" />
        Siram 1 detik
      </button>

      {/* Tombol untuk Siram 3 detik */}
      {/* <button disabled={action} onClick={() => watering("3")} className={`h-12 px-6 flex items-center gap-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 focus:outline-none ${action ? "opacity-50 cursor-not-allowed" : ""}`}>
        <GlassWater className="w-5 h-5" />
        Siram 3 detik
      </button> */}
    </div>
  );
}
