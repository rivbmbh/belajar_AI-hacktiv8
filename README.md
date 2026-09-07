# 💖 Curhat Bareng Tia AI - Teman Cerita Setia & Empatis 24/7

**Tia AI** adalah platform *virtual listening companion* yang dirancang untuk mendengarkan keluh kesah, cerita harian, dan masalah pengguna tanpa menghakimi (*zero judgement*). Dilengkapi dengan kecerdasan buatan terpersonalisasi, Tia AI siap memberikan respons hangat, empati tinggi, serta saran yang suportif dan realistis kapan saja.

---

## 🚀 Tech Stack

### Frontend
- **HTML5 & Vanilla CSS3**: Desain modern menggunakan visual glassmorphism, gradien halus, animasi mikro, serta responsif di berbagai perangkat.
- **Vanilla JavaScript (ES6+)**: Manajemen state lokal (*profile* & *chat history* via `localStorage`), event handler interaktif, dan fetch API.
- **FontAwesome 6**: Ikonografi UI.
- **Google Fonts**: Typography menggunakan *Outfit* & *Plus Jakarta Sans*.
- **Marked.js**: Parsing respons Markdown dari AI menjadi HTML interaktif secara *real-time*.

### Backend
- **Node.js**: Runtime environment dengan standar ES Modules (`"type": "module"`).
- **Express.js v5**: Web framework backend berbasis arsitektur terstruktur (Layered / MVC Architecture).
- **Google GenAI SDK (`@google/genai`)**: Integrasi dengan model kecerdasan buatan Google (`gemini-3.5-flash-lite`).
- **Multer**: Middleware pengolahan file upload (*image*, *document*, *audio*) via memory buffer.
- **CORS & Dotenv**: Middleware keamanan akses lintas domain dan pengelolaan variabel lingkungan.
- **Nodemon**: Utility pemantau perubahan kode (*hot-reloading*) selama pengembangan.

---

## 📁 Struktur Folder Project

Aplikasi ini menggunakan struktur folder bersih yang memisahkan antara frontend static assets dan backend modular logic:

```
edu-tech/
├── .env                        # Konfigurasi Environment Variables (API Keys)
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & script runner
├── README.md                   # Dokumentasi penggunaan project
│
├── public/                     # FRONTEND (Static Web Assets)
│   ├── assets/                 # Gambar & media (hero carousel)
│   ├── css/
│   │   └── style.css           # Custom CSS design system & component styles
│   ├── js/
│   │   └── script.js           # Logic client: UI interactions & API integration
│   └── index.html              # Main HTML page
│
└── src/                        # BACKEND (Node.js/Express Modular Code)
    ├── config/
    │   └── gemini.config.js    # Inisialisasi Google GenAI SDK & Model Constant
    ├── services/
    │   ├── ai.service.js       # Logic integrasi multimodal AI (text, image, doc, audio)
    │   └── chat.service.js     # Logic perakitan prompt sistem & personalisasi profil user
    ├── controllers/
    │   ├── ai.controller.js    # Request & Response handler untuk AI generation
    │   └── chat.controller.js  # Request & Response handler untuk Chat API
    ├── middlewares/
    │   ├── upload.middleware.js # Konfigurasi Multer file upload
    │   └── error.middleware.js  # Centralized Express error handler
    ├── routes/
    │   ├── ai.routes.js        # Definsi Rute AI generation
    │   ├── chat.routes.js      # Definisi Rute Chat API
    │   └── index.js            # Router hub penyatu seluruh rute
    ├── app.js                  # Setup Express (middlewares, static serve, rute, error handler)
    └── server.js               # Entry point peluncur HTTP Server
```

---

## 🛠️ Prasyarat (Prerequisites)

Pastikan sistem Anda sudah ter-install:
- **Node.js** (Versi 18 ke atas disarankan)
- **npm** (Node Package Manager)
- **Google Gemini API Key** (Dapatkan dari [Google AI Studio](https://aistudio.google.com/))

---

## ⚙️ Cara Install & Menjalankan Project

### 1. Clone / Buka Repository
Buka terminal pada direktori project:
```bash
cd edu-tech
```

### 2. Install Dependencies
Jalankan perintah berikut untuk mengunduh seluruh package yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat file bernama `.env` di root direktori project (jika belum ada), kemudian isi dengan API Key Anda:
```env
GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini
PORT=3000
```

### 4. Menjalankan Server

#### Mode Pengembangan (Development)
Menjalankan server dengan `nodemon` yang otomatis *reload* jika ada perubahan kode:
```bash
npm run dev
```

#### Mode Produksi (Production)
Menjalankan server dalam mode standar:
```bash
npm start
```

### 5. Akses Aplikasi Web
Buka browser favorit Anda dan akses alamat berikut:
```
http://localhost:3000
```

---

## 📡 Dokumentasi Endpoint API

| Method | Endpoint | Deskripsi | Form Data / JSON Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Endpoint percakapan interaktif dengan Tia AI. | `{ conversation: [...], userProfile: { name, gender, age, status } }` |
| `POST` | `/generate-text` | Generasi teks umum menggunakan Gemini AI. | `{ prompt: "String prompt" }` |
| `POST` | `/generate-from-image` | Analisis / tanya jawab berdasarkan gambar. | `multipart/form-data` (file field: `image`, text field: `prompt`) |
| `POST` | `/generate-from-document` | Ringkasan / ekstraksi informasi dari dokumen. | `multipart/form-data` (file field: `document`, text field: `prompt`) |
| `POST` | `/generate-from-audio` | Transkripsi / ringkasan berkas suara/audio. | `multipart/form-data` (file field: `audio`, text field: `prompt`) |

---

## 💡 Fitur Utama Aplikasi

1. **Personalisasi Profil User**: Pengguna dapat mengisi Nama, Jenis Kelamin, Usia, dan Status/Kondisi untuk mendapatkan pengalaman mengobrol yang personal dan relevan.
2. **Floating Chat Widget**: Widget obrolan yang dapat dibuka-tutup secara fleksibel di pojok kanan bawah.
3. **Manajemen Riwayat Chat**: Obrolan tersimpan otomatis di `localStorage` peranti pengguna dan dapat dihapus kapan saja (*Clear Chat*).
4. **Hero Image Carousel**: Tampilan visual interaktif pada bagian beranda.
5. **Multimodal Capability**: Siap dikembangkan untuk fitur analisis dokumen, foto, maupun rekaman suara.

---

## 📜 Lisensi
Project ini dibuat untuk tujuan edukasi dan pelatihan Hacktiv8.
