import { AnimatePresence, motion } from "framer-motion";
import moment from "moment-timezone";
import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState(moment.tz("Asia/Jakarta"));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTime(moment.tz("Asia/Jakarta"));
        }, 1_000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const hours = time.format("HH");
    const minutes = time.format("mm");
    const seconds = time.format("ss");
    const date = time.format("dddd, D MMMM YYYY");
    const isEvening = parseInt(hours) >= 18 || parseInt(hours) < 6;

    return (
        <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl animate-pulse"></div>
            
            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                {/* Time Display */}
                <div className="overflow-hidden flex flex-row items-center justify-center gap-1 sm:gap-2 relative font-bold mb-4">
                    <div className="flex items-center">
                        <AnimatedCounter n={hours} />
                        <motion.div
                            animate={{ 
                                opacity: [1, 0.3, 1],
                                scale: [1, 0.95, 1]
                            }}
                            transition={{ 
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-4xl sm:text-5xl lg:text-6xl mx-1 bg-gradient-to-b from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                        >
                            :
                        </motion.div>
                        <AnimatedCounter n={minutes} />
                        <motion.div
                            animate={{ 
                                opacity: [1, 0.3, 1],
                                scale: [1, 0.95, 1]
                            }}
                            transition={{ 
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                            className="text-4xl sm:text-5xl lg:text-6xl mx-1 bg-gradient-to-b from-purple-400 to-pink-500 bg-clip-text text-transparent"
                        >
                            :
                        </motion.div>
                        <AnimatedCounter n={seconds} />
                    </div>

                    <motion.div
                        layoutId="timezone"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="text-xl sm:text-2xl lg:text-3xl ml-2 sm:ml-4 font-medium bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
                    >
                        WIB
                    </motion.div>
                </div>

                {/* Date Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-center"
                >
                    <p className="text-lg sm:text-xl lg:text-2xl text-zinc-300/90 font-medium tracking-wide">
                        {date}
                    </p>
                </motion.div>

                {/* Time Period Indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="flex items-center justify-center mt-4 gap-2"
                >
                    <motion.div
                        animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className={`w-3 h-3 rounded-full ${
                            isEvening 
                                ? 'bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg shadow-purple-500/50' 
                                : 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/50'
                        }`}
                    />
                    <span className="text-sm font-medium text-zinc-400">
                        {isEvening ? 'Evening' : 'Daytime'}
                    </span>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400/50 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-ping delay-700"></div>
                <div className="absolute top-1/2 left-2 w-1 h-1 bg-pink-400/50 rounded-full animate-ping delay-1000"></div>
            </div>
        </div>
    );
}

const AnimatedCounter = ({ n }: { n: string }) => {
    return (
        <div className="relative overflow-hidden">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={n}
                    initial={{ y: "100%", opacity: 0, scale: 0.8 }}
                    animate={{ 
                        y: "0%", 
                        opacity: 1, 
                        scale: 1,
                    }}
                    exit={{ 
                        y: "-100%", 
                        opacity: 0,
                        scale: 0.8
                    }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        damping: 25,
                        mass: 0.8
                    }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent drop-shadow-lg"
                >
                    {n}
                </motion.div>
            </AnimatePresence>
            
            {/* Subtle glow effect for numbers */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5 rounded-lg blur-sm -z-10"></div>
        </div>
    );
};