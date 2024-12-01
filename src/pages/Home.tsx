import Clock from "../components/Clock";
import Content from "../components/Content/Content";
import Status from "../components/Status";

export default function Home() {
    return (
        <div className="h-screen bg-zinc-900 text-zinc-300 font-raleway p-4 flex">
            <div className="container mx-auto flex flex-col gap-4 overflow-auto flex-1">
                <Clock />
                <Status />
                <Content />
            </div>
        </div>
    );
}
