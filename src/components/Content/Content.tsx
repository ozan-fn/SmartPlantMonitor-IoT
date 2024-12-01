import { AnimatePresence, motion } from "framer-motion";
import { HomeIcon, InfoIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import Home from "./Home";
import Team from "./Team";
import Info from "./Info";

export default function Content() {
    const [tab, setTab] = useState("home");

    const tabs = [
        { id: "home", icon: HomeIcon, label: "Home" },
        { id: "info", icon: InfoIcon, label: "Info" },
        // { id: "logs", icon: LogsIcon, label: "Logs" },
        { id: "team", icon: UsersIcon, label: "Team" },
    ];

    const renderContent = () => {
        switch (tab) {
            case "home":
                return <Home />;
            case "info":
                return <Info />;
            case "team":
                return <Team />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="border border-zinc-700 rounded-md grid grid-cols-3 md:w-fit">
                {tabs.map(({ id, icon: Icon, label }) => (
                    <div key={id} className="relative flex">
                        {tab === id && <motion.div layoutId="tabs" transition={{ type: "spring" }} className="bg-zinc-300 rounded-md absolute inset-0" />}
                        <button onClick={() => setTab(id)} className="text-base rounded-md w-full py-2 md:py-0 md:h-12 px-4 relative mix-blend-exclusion">
                            <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                                <Icon className="h-6 w-6" />
                                {label}
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="overflow-auto flex flex-1">
                <AnimatePresence mode="wait">
                    <motion.div className="overflow-hidden flex flex-1 flex-col" key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, type: "spring" }}>
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
}
