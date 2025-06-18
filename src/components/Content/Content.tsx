import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Home from "./Home";

export default function Content() {
    const [tab] = useState("home");

    function renderContent(): import("react").ReactNode | import("framer-motion").MotionValue<number> | import("framer-motion").MotionValue<string> {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="overflow-auto flex flex-1">
    {tab === "home" ? (
        <div className="overflow-hidden flex flex-1 flex-col">
            <Home />
        </div>
    ) : (
        <AnimatePresence mode="wait">
            <motion.div
                className="overflow-hidden flex flex-1 flex-col"
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, type: "spring" }}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
    )}
</div>

    );
}
