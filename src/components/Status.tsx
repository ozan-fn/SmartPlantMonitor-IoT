/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wifi, Server, Activity, Zap } from "lucide-react";
import mqttClient from "../mqttClient";
import { useEffect, useRef, useState } from "react";

export default function Status() {
  const [mqttConnected, setMqttConnected] = useState(false);
  const [esp8266Connected, setEsp8266Connected] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const pingTimeRef = useRef(new Date());

  useEffect(() => {
    const checkConnection = () => {
      setMqttConnected(mqttClient.connected);
      
      if (pingTimeRef.current) {
        const timeDifference = new Date().getTime() - pingTimeRef.current.getTime();
        const isConnected = timeDifference <= 2000;
        setEsp8266Connected(isConnected);
        
        if (!isConnected) {
          setConnectionQuality('disconnected');
        } else if (timeDifference < 500) {
          setConnectionQuality('excellent');
        } else if (timeDifference < 1000) {
          setConnectionQuality('good');
        } else {
          setConnectionQuality('poor');
        }
      }
    };

    const intervalId = setInterval(checkConnection, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleMessage = (topic: string) => {
      if (topic === "ping") {
        const now = new Date();
        pingTimeRef.current = now;
        setLastPingTime(now);
      }
    };

    mqttClient.on("message", handleMessage);

    return () => {
      mqttClient.off("message", handleMessage);
    };
  }, []);

  const getConnectionColor = (connected: boolean, quality?: string) => {
    if (!connected) return {
      bg: 'bg-red-500',
      shadow: 'shadow-red-500/50',
      border: 'border-red-500/30',
      text: 'text-red-400',
      gradient: 'from-red-500/20 to-red-600/10'
    };
    
    switch (quality) {
      case 'excellent':
        return {
          bg: 'bg-emerald-500',
          shadow: 'shadow-emerald-500/50',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          gradient: 'from-emerald-500/20 to-emerald-600/10'
        };
      case 'good':
        return {
          bg: 'bg-green-500',
          shadow: 'shadow-green-500/50',
          border: 'border-green-500/30',
          text: 'text-green-400',
          gradient: 'from-green-500/20 to-green-600/10'
        };
      case 'poor':
        return {
          bg: 'bg-yellow-500',
          shadow: 'shadow-yellow-500/50',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          gradient: 'from-yellow-500/20 to-yellow-600/10'
        };
      default:
        return {
          bg: 'bg-green-500',
          shadow: 'shadow-green-500/50',
          border: 'border-green-500/30',
          text: 'text-green-400',
          gradient: 'from-green-500/20 to-green-600/10'
        };
    }
  };

  const mqttColors = getConnectionColor(mqttConnected);
  const esp8266Colors = getConnectionColor(esp8266Connected, connectionQuality);

  const StatusCard = ({ 
    icon: Icon, 
    title, 
    connected, 
    colors, 
    showQuality = false,
    quality,
    lastPing 
  }: {
    icon: any,
    title: string,
    connected: boolean,
    colors: any,
    showQuality?: boolean,
    quality?: string,
    lastPing?: Date | null
  }) => (
    <div
      className={`relative overflow-hidden backdrop-blur-sm bg-gradient-to-br ${colors.gradient} 
                  border ${colors.border} rounded-2xl p-4 sm:p-5 
                  shadow-lg group min-w-[280px] sm:min-w-[320px]`}
    >
      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 
                     border border-white/20 shadow-lg`}
        >
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">{title}</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className={`text-sm font-medium ${colors.text}`}>
                {connected ? "Connected" : "Disconnected"}
              </span>
              {showQuality && connected && (
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-zinc-400" />
                  <span className="text-xs text-zinc-400 capitalize">
                    {quality} signal
                  </span>
                </div>
              )}
              {lastPing && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">
                    {lastPing.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            <div className="relative">
              <div className={`w-4 h-4 rounded-full ${colors.bg} shadow-lg ${colors.shadow}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-100">System Status</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <StatusCard
          icon={Server}
          title="MQTT Broker"
          connected={mqttConnected}
          colors={mqttColors}
        />
        <StatusCard
          icon={Wifi}
          title="ESP8266 Device"
          connected={esp8266Connected}
          colors={esp8266Colors}
          showQuality={true}
          quality={connectionQuality}
          lastPing={lastPingTime}
        />
      </div>
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">System Health</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                mqttConnected && esp8266Connected ? 'bg-emerald-500' : 
                mqttConnected || esp8266Connected ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {mqttConnected && esp8266Connected ? 'All Systems Operational' :
               mqttConnected || esp8266Connected ? 'Partial Connection' : 'Systems Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}