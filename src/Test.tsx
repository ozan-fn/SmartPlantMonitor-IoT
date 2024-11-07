import { motion } from "framer-motion";

export default function Test() {
  return (
    <>
      <div className="h-screen bg-zinc-900">
        <div className="container mx-auto flex items-center h-full justify-center">
          <div className="h-96 w-96 border border-green-500 bg-green-500 rounded-full relative">
            <motion.div animate={{ rotate: [0, 180, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} className="w-full h-1 top-1/2 translate-y-1/2 absolute">
              <div className="absolute w-1/2 inset-0 bg-white"></div>
            </motion.div>

            <div className="absolute w-full h-1 bg-white top-1/2"></div>
            <div className="absolute w-1/2 h-1 bg-white left-1/4 top-1/4 rotate-90"></div>
            <div className="absolute border-2 h-1/2 w-1/2 top-1/4 left-1/4 rounded-full" />
            <div className="absolute border-2 h-32 w-32 top-1/3 left-1/3 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}
