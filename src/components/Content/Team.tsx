export default function Team() {
  return (
    <div className="mx-auto bg-zinc-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Anggota Tim</h2>
      <table className="table w-full text-lg text-left">
        <thead>
          <tr>
            <th className="p-2">Nama</th>
            <th className="p-2">NIM</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-zinc-700">
            <td className="p-2">- AKHMAD FAUZAN</td>
            <td className="p-2">23SA11A032</td>
          </tr>
          <tr className="border-t border-zinc-700">
            <td className="p-2">- DEVAN MAULANA SATRIANI</td>
            <td className="p-2">23SA11A033</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
