Nama: Fajar Muhairi
Npm: 223510258

# Uas Backend

## Persyaratan

Pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:

- [Node.js](https://nodejs.org/) (disarankan versi LTS)
- [MongoDB](https://www.mongodb.com/) (disarankan menggunakan MongoDB Atlas untuk kemudahan)

## Langkah-langkah Menjalankan Backend

### 1. Clone Repository

Clone repository ini ke komputer Anda:

```bash
git clone https://github.com/username/repository.git
cd repository/backend
```

### 2. Install Dependensi

Jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan:

```bash
npm install
```

### 3. Konfigurasi Database

Pastikan Anda telah mengubah URL koneksi MongoDB di file `config/db.js` sesuai dengan URL MongoDB Anda. Jika Anda menggunakan MongoDB Atlas, URL-nya akan terlihat seperti ini:

```javascript
await mongoose.connect(
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority"
);
```

Gantilah `<username>`, `<password>`, dan `<dbname>` dengan informasi yang sesuai.

### 4. Konfigurasi JWT Secret

Pastikan Anda telah mengubah JWT Secret di file `middleware/auth.js` dan `routes/auth.js` sesuai dengan secret key Anda. Contoh:

```javascript
const jwtSecret = "your_jwt_secret_key";
```

### 5. Jalankan Server

Setelah menginstal semua dependensi dan mengonfigurasi database serta JWT Secret, jalankan server dengan perintah berikut:

```bash
node server.js
```

Server akan berjalan di port 5000 secara default. Anda dapat mengakses API di `http://localhost:5000`.

## API Endpoints

Berikut adalah beberapa endpoint yang tersedia di backend:

- `POST /api/auth/register`: Mendaftarkan pengguna baru.
- `POST /api/auth/login`: Login pengguna.
- `GET /api/auth`: Mendapatkan data pengguna yang sedang login.
- `POST /api/pendapatan`: Menambahkan pendapatan.
- `GET /api/pendapatan`: Mendapatkan pendapatan berdasarkan tanggal.
- `DELETE /api/pendapatan/:id`: Menghapus pendapatan.
- `POST /api/pengeluaran`: Menambahkan pengeluaran.
- `GET /api/pengeluaran`: Mendapatkan pengeluaran berdasarkan tanggal.
- `DELETE /api/pengeluaran/:id`: Menghapus pengeluaran.
- `POST /api/transfer`: Menambahkan transfer.
- `GET /api/transfer`: Mendapatkan transfer berdasarkan tanggal.
- `DELETE /api/transfer/:id`: Menghapus transfer.
- `GET /api/aset`: Mendapatkan data aset pengguna.
- `POST /api/memo`: Menambahkan memo.
- `GET /api/memo`: Mendapatkan semua memo pengguna.
- `PUT /api/memo/:id`: Memperbarui memo.
- `DELETE /api/memo/:id`: Menghapus memo.

## Troubleshooting

Jika Anda mengalami masalah saat menjalankan aplikasi, pastikan hal-hal berikut:

- Semua dependensi telah terinstal dengan benar.
- URL koneksi MongoDB telah dikonfigurasi dengan benar.
- JWT Secret telah dikonfigurasi dengan benar.

Jika masalah masih berlanjut, silakan periksa log kesalahan di terminal untuk informasi lebih lanjut.

## Kontak

Jika Anda memiliki pertanyaan atau masalah, silakan hubungi [fajarmuhairi@student.uir.ac.id](mailto:fajarmuhairi@student.uir.ac.id).
