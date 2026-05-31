import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Home as HomeIcon, Database } from "lucide-react";
import Home from "./Home";
import Log from "./Log";

export default function Content() {
    const [tab, setTab] = useState("home");

    const renderContent = () => {
        switch (tab) {
            case "home":
                return <Home />;
            case "log":
                return <Log />;
            default:
                return <Home />;
        }
    };

    const tabs = [
        { id: "home", label: "Dashboard", icon: HomeIcon },
        { id: "log", label: "Data Logs", icon: Database },
    ];

    return (
        <div className="overflow-auto flex flex-1 flex-col">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 flex-1 sm:flex-initial
                            ${tab === t.id
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-slate-700/50"
                            }`}
                    >
                        <t.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    className="overflow-hidden flex flex-1 flex-col"
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, type: "spring" }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
