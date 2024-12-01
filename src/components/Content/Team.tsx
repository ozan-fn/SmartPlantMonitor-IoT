import { InstagramIcon } from "lucide-react";

export default function Team() {
    return (
        <div className="flex-1 mt-12 bg-zinc-900 text-white rounded-lg shadow-lg overflow-auto">
            <h2 className="text-3xl font-semibold text-center mb-6">Anggota Tim 4Trio</h2>
            <table className="table w-full text-lg text-left">
                <thead>
                    <tr>
                        <th className="p-2">Nama</th>
                        <th className="p-2">Instagram</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-zinc-700">
                        <td className="p-2 capitalize">AKHMAD FAUZAN</td>
                        <td className="p-2">
                            <a className="flex flex-row items-center gap-2" href="https://www.instagram.com/ozan.fn">
                                <InstagramIcon />
                                ozan.fn
                            </a>
                        </td>
                    </tr>
                    <tr className="border-t border-zinc-700">
                        <td className="p-2 capitalize">MUHAMMAD AGUS PRIYANTO</td>
                        <td className="p-2 cursor-pointer">
                            <a className="flex flex-row items-center gap-2" href="https://www.instagram.com/Rheiyn._">
                                <InstagramIcon />
                                Rheiyn._
                            </a>
                        </td>
                    </tr>
                    <tr className="border-t border-zinc-700">
                        <td className="p-2 capitalize">Firman zamzami aziz</td>
                        <td className="p-2">
                            <a className="flex flex-row items-center gap-2" href="https://www.instagram.com/Gw_firman">
                                <InstagramIcon />
                                Gw_firman
                            </a>
                        </td>
                    </tr>
                    <tr className="border-t border-zinc-700">
                        <td className="p-2 capitalize">Muhammad Zhiya Ulhaq</td>
                        <td className="p-2">
                            <a className="flex flex-row items-center gap-2" href="https://www.instagram.com/Zhiya.Ulhaq">
                                <InstagramIcon />
                                Zhiya.Ulhaq
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="h-20 w-1" />
        </div>
    );
}
