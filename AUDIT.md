Audit per halaman (berdasar deploy & repo)
1) Landing (/)

Apa yang ada sekarang

Tagline & value props: “Insight < 3s • Alert < 1s • Sei Network Native Analytics”, CTA “Analyze Wallet”, serta contoh persona “Demo Whale / DeFi Trader / NFT Collector”. 
SeiScout

Masalah / celah

Belum ada bukti bahwa “Insight <3s” & “Alert <1s” benar-benar terjadi (tidak ada timestamp, log, atau tautan explorer).

“Analyze Wallet” dan “Demo Whale” tampak tidak memuat data on-chain yang bisa diverifikasi (tidak ada link ke Seitrace / Seistream).

Bukti yang perlu ditampilkan

Tampilkan metrik real: waktu mulai analisis → waktu insight siap; waktu event on-chain terdeteksi → waktu alert terkirim, dengan tautan transaksi/addr di Seitrace. (Explorer resmi: Seitrace/Seistream. 
Seitrace
Sei Docs
)

2) Dashboard (/dashboard)

Apa yang ada sekarang

Hanya menampilkan “Loading wallet analysis…”. Tidak muncul konten. 
SeiScout

Masalah / celah

Belum ada fetch data atau fallback sample yang bisa diinspeksi juri.

Bukti yang perlu ditampilkan

Minimal 5 wallet contoh pada dropdown + tabel ringkas (saldo, #tx 24h, DEX trades 24h) dengan setiap baris punya tombol “View on Seitrace”. (Format URL Seitrace untuk tx/address tersedia & chain=pacific-1.) 
GitHub
Sei Docs

3) Analysis (/analysis)

Apa yang ada sekarang

Seksi Advanced Wallet Analysis berisi: Behavioral Matrix, Transaction Patterns (“Regular, predictable”), Predictive Insights (“Likely to increase DeFi allocation by 15% (60% confidence)”, “May exit NEBULA within 7 days (73%)”, dll), Risk Assessment (Identity/Contract/Liquidity/Behavior). Semua tampak statik, memakai alamat gaya sei1whale... dan tanggal lama. 
SeiScout

Masalah / celah

Tidak ada tautan ke transaksi/alamat di explorer → tidak bisa diverifikasi.

“Load Network Data” tertulis, tapi tak terlihat interaksi nyata (no spinner/hasil/tautan).

Prediksi & skor tidak jelaskan why (fitur dan kontribusinya).

Bukti yang perlu ditampilkan

Untuk setiap insight, tunjukkan:

TX hashes/alamat yang melandasi insight + link Seitrace. (Sei EVM chain id 1329, RPC resmi https://evm-rpc.sei-apis.com untuk ambil log/tx.) 
Sei Docs

Confidence dihitung dari rule (mis. jumlah sinyal + reliabilitas sumber) — tampilkan metodologi ringkas.

4) Opportunities (/opportunities)

Apa yang ada sekarang

“Top Performing Wallets” dengan kolom PNL / Sharpe / Volume / Win Rate + tombol Mirror Trade. Ada “Your Mirror Portfolio” dan Market Insights. Konten terlihat statik (angka rapi, tanpa tautan ke alamat/kontrak). 
SeiScout

Masalah / celah

Tidak ada sumber data PNL/Sharpe (dari mana harga & posisi?).

Tombol Mirror Trade tidak membuka rute swap/kontrak DEX di Sei.

Bukti yang perlu ditampilkan

Address nyata untuk setiap baris + link Seitrace address/tx. (Contoh DEX di Sei: DragonSwap punya alamat router/factory terdokumentasi—bisa dipakai untuk rute Mirror Trade awal.) 
DragonSwap

5) Repo (struktur & status)

Apa yang ada sekarang

Repo auto-sync dari v0, dengan file UI komponen seperti flash-alert-feed.tsx, spending-patterns-chart.tsx, sei-network-status.tsx. README menyebut “Automatically synced with v0.app deployments” (belum ada instruksi run, arsitektur, atau env). 
GitHub

Masalah / celah

Tidak ada integrasi wallet EVM Sei, tidak ada pemanggilan RPC/viem/ethers, tidak ada serverless API routes untuk analitik, tidak ada test/CI.

Apakah sudah “verbatim” sesuai deskripsi?

“Monitoring & analyzing specific wallets, insights into spending patterns, potential investment strategies, alerts on unusual activities, all integrated with Sei.”

Butir	Status saat ini	Catatan bukti
Monitor dompet spesifik	⚠️ UI ada (Analyze Wallet, persona), tapi belum ada data on-chain & watchlist nyata	Landing & Analysis menampilkan teks generik, tanpa link explorer. 
SeiScout
+1

Spending patterns	⚠️ Ada teks “Transaction Patterns: Regular, predictable” & komponen chart di repo	Masih statik; perlu log/tx riil & chart dari data. 
SeiScout
GitHub

Investment strategies (mirror/alpha)	⚠️ Halaman Opportunities ada PNL/Sharpe & Mirror Trade	Perlu sumber harga/posisi + rute ke DEX. 
SeiScout

Alerts anomali	⚠️ Ada komponen flash-alert-feed.tsx & klaim <1s	Belum ada webhook/feed realtime & bukti latensi. 
GitHub

Integrasi Sei	❌ Belum terbukti	Wajib koneksi wallet Sei EVM (chainId 1329) + RPC & link explorer. 
Sei Docs
Rencana implementasi teknis (by page) + snippet

Target hari ini: benang merah data on-chain → UI tampil → bisa diverifikasi di Seitrace.

A. Fondasi (shared)

Wallet connect + network guard (Sei EVM 1329)

Gunakan viem + wagmi/web3modal:

// viem + wagmi
import { http, createConfig } from 'wagmi'
import { createClient } from 'viem'
export const sei = {
  id: 1329, name: 'Sei',
  rpcUrls: { default: { http: ['https://evm-rpc.sei-apis.com'] } },
} as const

export const viemClient = createClient({ chain: sei, transport: http() })
// guard: jika chainId !== 1329 → minta switch network


(Chain & RPC resmi ada di docs.) 
Sei Docs

Explorer link helper (Seitrace/Seistream)

export const seitraceAddr = (addr:string)=>`https://seitrace.com/address/${addr}?chain=pacific-1`
export const seitraceTx   = (tx:string)=>`https://seitrace.com/tx/${tx}?chain=pacific-1`


(Format tx_page & chain pacific-1 didokumentasikan.) 
GitHub
Sei Docs

Serverless API (Next.js app router)

/app/api/wallet/[address]/analysis/route.ts

/app/api/wallet/[address]/events/route.ts

/app/api/opportunities/top/route.ts

B. Dashboard

Tujuan: ringkasan cepat 24 jam + dropdown sample wallets agar juri bisa klik tanpa connect.

Implementasi:

Ambil 5000 blok terakhir via viemClient.getLogs untuk event Transfer(address,address,uint256) + native transfers.

Agregasi: #tx, volume, top counterparties.

Tampilkan tabel + View on Seitrace per address & contoh sample wallet.

Kriteria bukti:

Setiap baris punya link address explorer & time window yang tertulis. (Explorer: Seitrace/Seistream.) 
Seitrace
Sei Docs

C. Analysis

Tujuan: analisis perilaku & prediksi dengan sumber data transparan.

Implementasi:

Patterns: deteksi DCA = variansi nominal & interval antar-tx rendah; tampilkan statistik (avg size, stddev, interval).

Hold duration: hitung rata-rata umur UTXO/token (approksimasi via first-in/last-out untuk ERC-20 sederhana).

Risk scoring (0–100):

Identity: interaksi dgn alamat “flagged” (daftar lokal).

Contract: proporsi tx ke kontrak tak terverifikasi.

Liquidity: rasio keluar-masuk pool besar (router DEX).

Behavior: burst anomali (z-score terhadap baseline 7 hari).

Predictive insights: aturan sederhana (contoh: kenaikan deposit ke router DEX + peningkatan inbound stablecoin → “kemungkinan tambah alokasi DeFi”).

Snippet (ambil log ERC-20 & native)

import { parseAbiItem } from 'viem'
const transferTopic = parseAbiItem('event Transfer(address indexed from,address indexed to,uint256 value)')
const logs = await viemClient.getLogs({
  fromBlock: BigInt(latestBlock)-5000n,
  toBlock: 'latest',
  topics: [transferTopic.topic],
  // optional: address filter = token list
})


Kriteria bukti:

Di bawah setiap insight/prediksi muncul “Evidence”: ≥3 tx hash (sebagai bullet) + link Seitrace; tampilkan Confidence dan metodologi singkat (1–2 kalimat). (ChainId & RPC: dok resmi.) 
Sei Docs

Tombol “Load Network Data” benar-benar memicu fetch & render (no dummy). (Teks tersebut sekarang sudah ada di halaman.) 
SeiScout

D. Opportunities

Tujuan: daftar wallet performa bagus + Mirror Trade yang benar-benar membuka rute swap.

Implementasi:

PNL/Sharpe (MVP): mulai dari realized PNL sederhana pada wSEI/USDC saja; sumber harga via AMM DragonSwap (router address terdokumentasi). 
DragonSwap

Mirror Trade: deep-link ke router DEX (prefill token in/out & slippage), atau minimal buka kontrak router dengan param prefilled.

Win rate: hitung dari (profit trades / total trades) berdasar transfer in/out token yang relevan.

Kriteria bukti:

Setiap baris wallet punya link address explorer; tombol Mirror Trade membuka rute di DEX Sei (DragonSwap sebagai awal). 
DragonSwap

E. Alerts (Flash)

Tujuan: <1s dari event on-chain → masuk Flash Alert Feed + webhook (Telegram/Discord).

Implementasi:

Streaming log dengan viem websockets (client.watchContractEvent/onLogs).

Event target MVP:

Transfer > X SEI/USDC

Interaksi router DEX (function selector)

Withdraw staking besar

Simpan detected_at & delivered_at → tampilkan latensi di UI (ms).

Kriteria bukti:

Setiap alert di feed memuat tx hash + latensi, link Seitrace.

/verify page menampilkan log 24 jam terakhir (csv/json download) untuk auditor.

“Definition of Done” (yang bisa kamu centang)

Integrasi Sei EVM nyata: detect/switch ke chainId 1329; connect via RPC https://evm-rpc.sei-apis.com. 
Sei Docs

Semua insight/angka punya bukti: minimal 1 link explorer per klaim (tx/address) — gunakan ?chain=pacific-1. 
GitHub

Alert realtime: feed memperlihatkan detected_at → delivered_at < 1s pada ≥3 contoh, dengan tx-link. (Sei mengklaim finality sub-400ms, jadi <1s sangat realistis.) 
Sei Blog
Sei Docs

Opportunities benar-benar “mirrorable”: tombol membuka rute DEX Sei (DragonSwap) atau kontrak router-nya. 
DragonSwap

README engineering: cara run, arsitektur, env, metodologi skor/prediksi, keterbatasan, dan How to verify (tautan contoh Seitrace). (Sekarang README masih auto-sync v0.) 
GitHub

Bukti minimum yang perlu kamu tampilkan di UI

Explorer links di setiap kartu insight / baris tabel (address/tx). (Seitrace/Seistream sebagai explorer resmi.) 
Seitrace
Sei Docs

Timestamps & latensi untuk alerts (angka konkret, bukan klaim).

Sample wallets kurasi (5–10) di dropdown Dashboard agar juri bisa klik langsung tanpa connect.

Badge “Sei EVM (1329)” di header (klik = membuka docs/networks). 
Sei Docs

Catatan terakhir (quick wins paling efektif)

Pasang koneksi MetaMask → Sei EVM 1329, cek/switch network. (MetaMask baru saja resmi integrasi Sei—nilai plus kalau kamu tampilkan.) 
Sei Blog
MetaMask

Ubah semua teks statik sei1whale... menjadi alamat nyata + tombol “View on Seitrace”. 
SeiScout
+1

Buat /api/wallet/[addr]/analysis & /api/wallet/[addr]/events → hubungkan ke komponen kamu (spending-patterns-chart.tsx, flash-alert-feed.tsx). (File tersebut sudah ada di repo.) 
GitHub

Tambahkan /verify: daftar alert 24h + unduh JSON/CSV (untuk juri).
