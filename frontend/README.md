Nama: Fajar Muhairi
Npm: 223510258

# Uas Frontend

## Persyaratan

Pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:

- [Node.js](https://nodejs.org/) (disarankan versi LTS)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Langkah-langkah Menjalankan Frontend

### 1. Clone Repository

Clone repository ini ke komputer Anda:

```bash
git clone https://github.com/username/repository.git
cd repository/frontend
```

### 2. Install Dependensi

Jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan:

```bash
npm install
```

### 3. Konfigurasi IP Backend

Pastikan Anda telah mengubah IP backend di file yang sesuai. Misalnya, di file `MemoScreen.js`, `LoginScreen.js`, dan file lainnya yang melakukan permintaan ke backend, pastikan IP backend sesuai dengan IP server backend Anda.

Contoh:

```javascript
const res = await axios.get("http://192.168.1.8:5000/api/memo", {
  headers: {
    "x-auth-token": token,
  },
});
```

Ubah `192.168.1.8` menjadi IP server backend Anda.

### 4. Jalankan Aplikasi

Setelah menginstal semua dependensi dan mengonfigurasi IP backend, jalankan aplikasi dengan perintah berikut:

```bash
npx expo start
```

Ini akan membuka Expo Developer Tools di browser Anda. Anda dapat menjalankan aplikasi di emulator Android/iOS atau di perangkat fisik menggunakan aplikasi Expo Go.

### 5. Menjalankan di Perangkat Fisik

Untuk menjalankan aplikasi di perangkat fisik, pastikan perangkat Anda terhubung ke jaringan yang sama dengan komputer Anda. Kemudian, pindai kode QR yang muncul di Expo Developer Tools menggunakan aplikasi Expo Go.

## Troubleshooting

Jika Anda mengalami masalah saat menjalankan aplikasi, pastikan hal-hal berikut:

- Semua dependensi telah terinstal dengan benar.
- IP backend telah dikonfigurasi dengan benar.
- Perangkat Anda terhubung ke jaringan yang sama dengan komputer Anda.

Jika masalah masih berlanjut, silakan periksa log kesalahan di terminal atau di Expo Developer Tools untuk informasi lebih lanjut.

## Kontak

Jika Anda memiliki pertanyaan atau masalah, silakan hubungi [fajarmuhairi@student.uir.ac.id](mailto:fajarmuhairi@student.uir.ac.id).
