# Portal Inventaris LabMGM, frontend

Frontend portal peminjaman untuk sistem inventaris LabMGM, ditulis dari
[PRD](https://claude.ai/artifact/FcySRnZfwzYLig23XKUVgc). Tahap ini hanya
tampilan dan alur, dengan data contoh di browser. Belum ada backend,
Keycloak, atau pengiriman email.

Untuk mencoba semua alurnya langkah demi langkah, ikuti [handson.md](handson.md).

[![CI](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/actions/workflows/ci.yaml/badge.svg)](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/actions/workflows/ci.yaml)
[![Security](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/actions/workflows/security.yaml/badge.svg)](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/actions/workflows/security.yaml)
[![Config lint](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/actions/workflows/config.yaml/badge.svg)](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/actions/workflows/config.yaml)

[![License](https://img.shields.io/github/license/MGM-Laboratory/mgm-inventaris-portal-frontend)](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

[![Last commit](https://img.shields.io/github/last-commit/MGM-Laboratory/mgm-inventaris-portal-frontend)](https://github.com/MGM-Laboratory/mgm-inventaris-portal-frontend/commits/main)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org)

## Stack

- Next.js 16 (App Router, Cache Components), React 19, TypeScript 5 dan Tailwind CSS 4.
- Data contoh di `localStorage`, semua akses lewat `src/lib/store.ts`.
- npm dan Node 24 (`.nvmrc`). Next.js 16 membutuhkan Node 20.9 atau lebih baru.
- CI di GitHub Actions, lihat [`docs/ci-cd.md`](docs/ci-cd.md).

## Menjalankan

```bash
npm install
npm run dev -- -p 3004
```

Buka http://localhost:3004. Halaman pertama adalah login: katalog dan keranjang
baru terbuka setelah masuk (Member, Guest dengan data diri, atau Admin contoh).
Bar di bawah layar (mode contoh) berganti peran
antara Guest, Member, dan Admin tanpa login sungguhan; "Atur ulang data"
mengembalikan data awal.

## Yang sudah ada

- Login lebih dulu (`/masuk`): member lewat akun MGM (contoh), guest mengisi
  nama, NIM atau NIP, dan email UB, Admin lewat tautan mode contoh. Pelacakan
  tiket dan halaman QR aset tetap bisa dibuka tanpa masuk.
- Katalog barang dengan pencarian, kategori, dan ketersediaan, dengan pilihan
  tampilan Ikon, Daftar, atau Rincian seperti di pengelola berkas.
- Keranjang dan form pengajuan memakai data diri dari login; peminjam hanya
  mengisi tujuan dan tanggal.
- Verifikasi email guest dengan kode contoh `123456`; sementara dimatikan (bendera `EMAIL_VERIFICATION` di `src/lib/store.ts`), jadi tiket guest langsung berstatus Diajukan.
- Tiket dengan nomor, status, riwayat, batal, cetak, dan unduh sebagai gambar
  PNG (2400 × 1080 px, selalu terang, berisi QR ke halaman tiket).
- Lacak tiket dengan nomor dan email.
- Admin: antrean, keputusan (setujui dengan jumlah dan lama yang diubah, atau
  tolak dengan catatan), siap diambil, serah terima, pengembalian.
- Halaman publik hasil pindai QR (`/aset/MGM-VRQ-004`): nama, status, dan
  tombol pinjam untuk siapa saja; nomor seri, kondisi, tempat, dan tiket
  terkait hanya untuk Admin.
- Manajemen aset untuk Admin: tambah barang sendiri (ketik nama barang, pilih atau
  tambah kategori baru) atau tambah unit untuk barang yang ada (satu atau banyak,
  kode QR otomatis),
  ubah nomor seri, kondisi, dan tempat, serta kurangi stok lewat Kirim ke
  perawatan, Tandai hilang, Pensiunkan, atau Aktifkan kembali. Setiap
  perubahan tercatat di riwayat aset. Unit yang sedang dipinjam atau dipesan
  tidak bisa diubah statusnya.
- Lembar label QR untuk dicetak (`/admin/label`) dalam tiga ukuran. Isi kode
  QR sudah diuji terbaca dan mengarah ke `/aset/<kode>`.
- Tampilan dengan identitas LabMGM: menu samping, bilah atas
  (cari kode aset, lonceng permintaan, keranjang, tema, masuk), dasbor angka
  berwarna dengan aktivitas terbaru dan agenda, serta tabel data untuk katalog,
  permintaan, dan aset. Warna, font Hanken Grotesk dan Geist, logo, dan pola
  mengikuti website utama labmgm.org. Terang dan gelap tersedia.

## Yang belum ada

Impor CSV, hapus permanen,
barcode 1D di label, pengadaan, infrastruktur, dan
permintaan lain (Rilis 2). Peminjaman ruangan tidak akan dibuat: MGM tidak
menyediakannya.

## Menyambungkan ke sistem nyata

Semua baca dan tulis data ada di `src/lib/store.ts`. Ganti isinya dengan
panggilan ke backend portal (tiket dan aset). Daftar barang
dan jumlahnya di `src/lib/mock-data.ts` adalah klaim lab, bukan hasil audit.

Aturan yang masih sementara dan perlu diputuskan: batas lama pinjam (sekarang
1 sampai 30 hari), batas 10 barang per permintaan (dari Pinjam yang lama), dan
nomor tiket (`MGM-yymm-nnnn-XXXX`, dengan empat karakter acak di belakang).

## Konfigurasi

Prototipe ini tidak membaca variabel lingkungan dan tidak punya berkas `.env`. Semua pengaturan ada di kode. Pengaturan seperti alamat backend ditambahkan saat backend tersambung.

## Dokumentasi

- [`handson.md`](handson.md) memandu mencoba semua alur langkah demi langkah.
- [`docs/ci-cd.md`](docs/ci-cd.md) mencantumkan workflow CI dan pemeriksaan yang diwajibkan.
- [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SECURITY.md`](SECURITY.md) dan [`ACCESSIBILITY.md`](ACCESSIBILITY.md) memuat aturan kontribusi, pelaporan keamanan, dan pernyataan aksesibilitas.

## Struktur proyek

```text
src/app/          Halaman dan rute (App Router)
src/components/   Kerangka aplikasi, tampilan, formulir, kode QR
src/lib/          Data (store.ts, mock-data.ts), tipe, format, tiket PNG
public/           Logo dan pola
docs/             Dokumentasi CI/CD
.github/          Workflow CI, templat isu dan pull request
```

## Berkontribusi dan keamanan

Baca [`CONTRIBUTING.md`](CONTRIBUTING.md) sebelum membuka pull request. Laporkan celah keamanan secara pribadi sesuai [`SECURITY.md`](SECURITY.md) dan jangan membuka isu publik. Aturan perilaku ada di [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Lisensi

GNU General Public License v3.0. Lihat [`LICENSE`](LICENSE).
