import { GlassWater, Timer } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      {/* Quick Watering Button */}
      <button
        disabled={action}
        onClick={() => watering("1")}
        className="relative flex items-center justify-center gap-3 px-6 h-12 sm:h-14 rounded-xl 
  text-white bg-blue-600 hover:bg-blue-500 transition duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-300
  "
      >
        <div className="relative">
          <GlassWater className={`w-5 h-5 transition-transform duration-300 ease-in-out ${action ? "animate-[bounce_1s_infinite]" : "group-hover:rotate-12"}`} />
          {action && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
          )}
        </div>
        <span className="font-medium text-sm sm:text-base transition-all duration-300">
          {action ? "Menyiram..." : "Siram Sekarang"}
        </span>
        {action && <Timer className="w-4 h-4 animate-[spin_1.2s_linear_infinite]" />}
      </button>


      {/* Status Indicator */}
      {action && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-sm font-medium">Sistem Aktif</span>
        </div>
      )}
    </div>
  );
}