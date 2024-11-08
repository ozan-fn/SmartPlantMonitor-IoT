export default function Info() {
  return (
    <div className="mx-auto space-y-6 bg-zinc-900 rounded-lg shadow-lg overflow-auto flex-1">
      <h2 className="text-3xl font-semibold text-center">Tentang Penyiram Otomatis Berbasis ESP8266</h2>

      <p className="text-lg">
        Penyiram otomatis berbasis <strong>ESP8266</strong> adalah solusi teknologi canggih yang dapat membantu Anda menjaga kebun atau tanaman Anda tetap terhidrasi dengan efisien. Sistem ini dirancang untuk memudahkan Anda dalam merawat tanaman, bahkan saat Anda sedang tidak berada di rumah. Dengan mengandalkan kemampuan <strong>Wi-Fi</strong>, perangkat ini dapat terhubung langsung dengan internet dan memungkinkan
        Anda untuk mengendalikan serta memonitor penyiraman tanaman dari mana saja dan kapan saja, hanya dengan menggunakan perangkat yang terhubung ke internet, seperti smartphone atau laptop.
      </p>

      <p className="text-lg">
        Sistem ini mengintegrasikan beberapa komponen penting, termasuk modul ESP8266 yang bertindak sebagai otak dari sistem penyiraman, serta platform <strong>MQTT</strong> yang memungkinkan komunikasi antara perangkat dan aplikasi. Anda dapat dengan mudah mengontrol penyiraman secara real-time, memantau status kelembaban tanah, suhu udara, dan kelembaban sekitar melalui aplikasi berbasis web atau perangkat mobile.
        Proses pengendalian ini sangat intuitif, hanya dengan menekan tombol pada aplikasi, sistem akan langsung merespon sesuai dengan perintah yang diberikan.
      </p>

      <p className="text-lg">
        Untuk mengatur kapan waktu terbaik untuk menyiram tanaman, sistem ini memanfaatkan sensor kelembaban tanah dan sensor suhu <strong>DHT11</strong> yang sangat efisien dalam memberikan data yang akurat. Sensor kelembaban tanah bekerja dengan mendeteksi tingkat kelembaban tanah yang dapat diukur dan dibandingkan dengan nilai ambang batas yang telah ditentukan. Jika kelembaban tanah berada di bawah ambang batas
        yang telah ditentukan, sistem akan mengaktifkan penyiraman tanaman secara otomatis. Begitu juga dengan sensor suhu, yang memungkinkan sistem untuk memantau suhu lingkungan sekitar dan memastikan bahwa tanaman disiram dengan kondisi yang sesuai dengan kebutuhan mereka.
      </p>

      <p className="text-lg">
        Sistem penyiram otomatis ini juga dapat mengirimkan notifikasi atau status terkait penyiraman tanaman dan kondisi lingkungan melalui platform MQTT, yang memastikan Anda selalu mendapatkan informasi terbaru. Misalnya, Anda dapat menerima pemberitahuan jika tanah sudah cukup lembab dan tidak perlu disiram lagi, atau jika suhu udara terlalu tinggi dan mempengaruhi kebutuhan tanaman untuk air. Sistem ini sangat
        berguna terutama untuk mereka yang sering bepergian atau tidak memiliki cukup waktu untuk merawat tanaman secara manual, menjadikannya pilihan ideal untuk kebun rumah atau bahkan kebun tanaman dalam ruangan.
      </p>

      <p className="text-lg">
        Tidak hanya memberikan kenyamanan, sistem penyiram otomatis berbasis ESP8266 ini juga menghemat air dan energi karena dapat disesuaikan dengan kondisi tanaman secara lebih akurat. Tanaman tidak akan lagi disiram secara berlebihan atau kekurangan air, sehingga dapat tumbuh dengan lebih sehat. Ini juga membantu mengurangi pemborosan air, yang sangat penting dalam menjaga keberlanjutan lingkungan.
      </p>

      <div className="border-t border-zinc-600 pt-6">
        <h3 className="text-xl font-semibold">Fitur Utama:</h3>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>
            <strong>Penyiraman otomatis:</strong> Menyiram tanaman secara otomatis berdasarkan data kelembaban tanah dan suhu lingkungan.
          </li>
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
