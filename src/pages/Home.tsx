import Clock from "../components/Clock";
import Content from "../components/Content/Content";
import Status from "../components/Status";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-zinc-100 font-raleway relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            
            {/* Main content */}
            <div className="relative z-10 p-4 sm:p-6 lg:p-8 min-h-screen flex">
                <div className="container mx-auto flex flex-col gap-4 sm:gap-6 lg:gap-8 overflow-auto flex-1 max-w-7xl">
                    {/* Glass morphism container */}
                    <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl">
                        <Clock />
                    </div>
                    
                    <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl">
                        <Status />
                    </div>
                    
                    <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl flex-1">
                        <Content />
                    </div>
                </div>
            </div>
            
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:50px_50px] pointer-events-none"></div>
        </div>
    );
}