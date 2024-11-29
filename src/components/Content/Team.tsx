export default function Team() {
    return (
        <div className="flex-1 mt-12 bg-zinc-900 text-white rounded-lg shadow-lg">
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
                            <a href="">ozan.fn</a>
                        </td>
                    </tr>
                    <tr className="border-t border-zinc-700">
                        <td className="p-2 capitalize">MUHAMMAD AGUS PRIYANTO</td>
                        <td className="p-2 cursor-pointer">
                            <a href="">Rheiyn._</a>
                        </td>
                    </tr>
                    <tr className="border-t border-zinc-700">
                        <td className="p-2 capitalize">Firman zamzami aziz</td>
                        <td className="p-2">
                            <a href="">Gw_firman</a>
                        </td>
                    </tr>
                    <tr className="border-t border-zinc-700">
                        <td className="p-2 capitalize">Muhammad Zhiya Ulhaq</td>
                        <td className="p-2">
                            <a href="">Zhiya.Ulhaq</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
