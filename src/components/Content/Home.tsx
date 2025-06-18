/* eslint-disable @typescript-eslint/no-explicit-any */
import { Droplet, Cloud, Thermometer, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import Action from "./SiramBtn";
import mqttClient from "../../mqttClient";
import { useEffect, useState } from "react";

export default function Home() {
    const [humidity, setHumidity] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [soilMoisture, setSoilMoisture] = useState(0);

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
        if (percentage < 30) return "#FF5A5A";
        if (percentage < 60) return "#FFDD57";
        return "#4CAF50";
    };

    // Get status info for each metric
    const getSoilStatus = (moisture: number) => {
        if (moisture < 30) return {
            status: 'critical',
            icon: AlertTriangle,
            message: "Kelembaban rendah - Mesin penyiram otomatis akan aktif.",
            color: 'text-red-400',
            bgGradient: 'from-red-500/20 to-red-600/10',
            borderColor: 'border-red-500/30'
        };
        return {
            status: 'good',
            icon: CheckCircle,
            message: "Kelembaban tanah memadai.",
            color: 'text-emerald-400',
            bgGradient: 'from-emerald-500/20 to-emerald-600/10',
            borderColor: 'border-emerald-500/30'
        };
    };

    const getHumidityStatus = (hum: number) => {
        if (hum < 30) return {
            icon: AlertTriangle,
            message: "Kelembaban udara rendah, tingkatkan kelembaban.",
            color: 'text-orange-400',
            bgGradient: 'from-orange-500/20 to-orange-600/10',
            borderColor: 'border-orange-500/30'
        };
        if (hum > 60) return {
            icon: TrendingUp,
            message: "Kelembaban tinggi, tetap monitor tanaman.",
            color: 'text-blue-400',
            bgGradient: 'from-blue-500/20 to-blue-600/10',
            borderColor: 'border-blue-500/30'
        };
        return {
            icon: CheckCircle,
            message: "Kelembaban udara normal.",
            color: 'text-emerald-400',
            bgGradient: 'from-emerald-500/20 to-emerald-600/10',
            borderColor: 'border-emerald-500/30'
        };
    };

    const getTemperatureStatus = (temp: number) => {
        if (temp < 15) return {
            icon: AlertTriangle,
            message: "Suhu rendah, tanaman mungkin butuh suhu lebih hangat.",
            color: 'text-cyan-400',
            bgGradient: 'from-cyan-500/20 to-cyan-600/10',
            borderColor: 'border-cyan-500/30'
        };
        if (temp > 30) return {
            icon: AlertTriangle,
            message: "Suhu tinggi, perhatikan kebutuhan air tanaman.",
            color: 'text-red-400',
            bgGradient: 'from-red-500/20 to-red-600/10',
            borderColor: 'border-red-500/30'
        };
        return {
            icon: CheckCircle,
            message: "Suhu dalam kondisi optimal.",
            color: 'text-emerald-400',
            bgGradient: 'from-emerald-500/20 to-emerald-600/10',
            borderColor: 'border-emerald-500/30'
        };
    };

    const soilStatus = getSoilStatus(soilMoisture);
    const humidityStatus = getHumidityStatus(humidity);
    const temperatureStatus = getTemperatureStatus(temperature);

    const MetricCard = ({
        icon: Icon,
        title,
        value,
        unit,
        percentage,
        status
    }: {
        icon: any,
        title: string,
        value: number,
        unit: string,
        percentage: number,
        status: any
    }) => (
        <div
            className={`relative overflow-hidden backdrop-blur-sm bg-gradient-to-br ${status.bgGradient} 
                       border ${status.borderColor} rounded-2xl p-5 sm:p-6 
                       shadow-lg group`}
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/20">
                            <Icon className="w-5 h-5 text-zinc-200" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-zinc-100">{value}</span>
                        <span className="text-sm text-zinc-400 ml-1">{unit}</span>
                    </div>
                </div>

                <div className="relative h-3 w-full bg-zinc-800/50 border border-zinc-700/50 rounded-full mb-4 overflow-hidden">
                    <div
                        style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: getIndicatorColor(percentage)
                        }}
                        className="absolute inset-y-0 left-0 rounded-full shadow-lg transition-all duration-700"
                    />
                </div>
                <div className="flex items-start gap-2 mt-1">
                    <status.icon className={`w-4 h-4 mt-0.5 ${status.color} flex-shrink-0`} />
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        {status.message}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Action />
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-100">Environmental Monitoring</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-auto">
                    <MetricCard
                        icon={Droplet}
                        title="Kelembaban Tanah"
                        value={soilMoisture}
                        unit="%"
                        percentage={soilMoisture}
                        status={soilStatus}
                    />
                    <MetricCard
                        icon={Cloud}
                        title="Kelembaban Udara"
                        value={humidity}
                        unit="%"
                        percentage={humidity}
                        status={humidityStatus}
                    />
                    <MetricCard
                        icon={Thermometer}
                        title="Suhu Udara"
                        value={temperature}
                        unit="°C"
                        percentage={(temperature + 10) * 2}
                        status={temperatureStatus}
                    />
                </div>
                <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-zinc-300">System Status</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm text-zinc-400">Monitoring Active</span>
                        </div>
                    </div>
                </div>
                <div className="h-8" />
            </div>
        </>
    );
}