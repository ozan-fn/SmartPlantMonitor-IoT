import { AnimatePresence, motion } from "framer-motion";
import moment from "moment-timezone";
import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(moment.tz("Asia/Jakarta"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.tz("Asia/Jakarta"));
    }, 1_000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.format("HH");
  const minutes = time.format("mm");
  const seconds = time.format("ss");
  const date = time.format("dddd, D MMMM YYYY");

  return (
    <>
      <div className="overflow-hidden flex flex-row gap-1 relative font-bold">
        <AnimatedCounter n={hours} />
        <motion.p transition={{ type: "spring" }} className="text-6xl">
          :
        </motion.p>
        <AnimatedCounter n={minutes} />
        <motion.p transition={{ type: "spring" }} className="text-6xl">
          :
        </motion.p>
        <AnimatedCounter n={seconds} />

        <motion.p layoutId="wib" transition={{ type: "spring" }} className="text-3xl ml-3">
          WIB
        </motion.p>
      </div>

      <motion.p className="text-2xl">{date}</motion.p>
    </>
  );
}

const AnimatedCounter = ({ n }: { n: string }) => {
  return (
    <AnimatePresence mode="popLayout">
      <motion.p key={n} animate={{ y: ["100%", "0%"] }} exit={{ y: ["0%", "-110%"] }} transition={{ type: "spring" }} className="text-6xl">
        {n}
      </motion.p>
    </AnimatePresence>
  );
};
