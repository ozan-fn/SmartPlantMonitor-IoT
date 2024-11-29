export default function Info() {
    return (
        <div className="mx-auto mt-12 pr-8 space-y-6 bg-zinc-900 rounded-lg shadow-lg overflow-auto flex-1 pb-12">
            <h2 className="text-3xl font-semibold text-center">SISTEM MONITORING DAN PENGELOLAAN TANAMAN BERBASIS WEBSITE MENGGUNAKAN NODEMCU ESP8266 DENGAN METODE MQTT</h2>

            <p className="text-md text-justify indent-8">
                Pertanian semakin terdorong oleh <strong>teknologi IoT (Internet of Things)</strong> yang memudahkan monitoring dan pengelolaan tanaman secara efisien, meningkatkan produktivitas dan kualitas. Namun, pemahaman masyarakat tentang penerapan IoT, terutama di daerah tertentu, masih terbatas akibat kurangnya informasi dan edukasi. Pengenalan teknologi ini menjadi langkah penting untuk mendukung
                keberlanjutan agrikultur, yang potensinya semakin relevan mengingat tren positif sektor pertanian. Data BPS (2024) menunjukkan ekspor hasil pertanian meningkat, menegaskan bahwa teknologi modern seperti IoT dapat mendukung pertumbuhan ekonomi nasional.
                <p className="text-md text-justify indent-8 mt-2">
                    Sistem penyiram otomatis menjadi solusi yang relevan untuk mengatasi masalah ini. Dengan memanfaatkan teknologi IoT, sistem ini memungkinkan penyiraman tanaman dilakukan secara otomatis berdasarkan data kelembaban tanah, memastikan kebutuhan air terpenuhi tanpa perlu pemantauan langsung. Hal ini tidak hanya menghemat waktu dan tenaga, tetapi juga meningkatkan efisiensi penggunaan air serta
                    mendukung keberlanjutan agrikultur modern.
                </p>
            </p>

            <div className="border-t border-zinc-600 pt-6">
                <h3 className="text-xl font-semibold">Tujuan:</h3>
                <ul className="list-disc list-inside space-y-2 text-lg mt-4">
                    <li>Menggunakan IoT untuk dapat memantau kondisi tanaman secara realtime dan penyiraman otomatis.</li>
                    <li>
                        <strong>Kontrol jarak jauh:</strong> Memungkinkan Anda untuk mengendalikan penyiraman dan memantau kondisi tanaman dari jarak jauh menggunakan platform berbasis Wi-Fi.
                    </li>
                    <li>
                        <strong>Integrasi MQTT:</strong> Sistem terhubung dengan platform MQTT untuk pengiriman status dan notifikasi secara real-time.
                    </li>
                    <li>
                        <strong>Sistem hemat air:</strong> Menggunakan sensor untuk menentukan kebutuhan air tanaman, sehingga tidak ada pemborosan air.
                    </li>
                </ul>
            </div>
        </div>
    );
}
