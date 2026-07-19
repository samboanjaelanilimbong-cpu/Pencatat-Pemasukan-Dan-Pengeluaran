// ===============================
// DATA TRANSAKSI (BUKU BESAR)
// ===============================
// Kita gunakan localStorage agar data tidak hilang saat web di-refresh
let riwayatTransaksi = JSON.parse(localStorage.getItem('riwayatUang')) || [];

// ===============================
// NAVIGASI HALAMAN
// ===============================
function bukaHalaman(idHalaman) {
  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  // Tampilkan halaman yang dituju
  document.getElementById(idHalaman).classList.add('active');
  
  // Jika membuka halaman Pemasukan/Pengeluaran, otomatis tampilkan daftarnya
  if(idHalaman === 'pemasukan' || idHalaman === 'pengeluaran') {
    tampilkanRiwayat();
  }
}

function bukaMenu() { 
  bukaHalaman('menu'); 
}

function kembaliHome() { 
  bukaHalaman('home'); 
  updateSaldoTampilan(); 
}

// ===============================
// LOGIKA TRANSAKSI (INPUT & SIMPAN)
// ===============================
function tambahPemasukan() {
  catatTransaksi('pemasukan');
}

function tambahPengeluaran() {
  catatTransaksi('pengeluaran');
}

function catatTransaksi(jenis) {
  const nominalInput = document.getElementById('nominal');
  const nominal = parseInt(nominalInput.value);
  
  if (!nominal || nominal <= 0) {
    tampilkanNotifikasi("Masukkan nominal yang valid! ❌");
    return;
  }

  // Bungkus data transaksi dengan tanggal hari ini
  const tanggalSekarang = new Date();
  const catatanBaru = {
    id: Date.now(),
    jenis: jenis,
    nominal: nominal,
    tanggal: tanggalSekarang.toLocaleDateString('id-ID'), // Format: DD/MM/YYYY
    waktu: tanggalSekarang.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})
  };

  // Masukkan ke array dan simpan permanen ke memori browser
  riwayatTransaksi.push(catatanBaru);
  localStorage.setItem('riwayatUang', JSON.stringify(riwayatTransaksi));

  updateSaldoTampilan();
  
  nominalInput.value = ""; // Bersihkan kolom input
  
  // Memanggil notifikasi kustom sesuai permintaan
  tampilkanNotifikasi("Berhasil ditambahkan ✅");
}

function updateSaldoTampilan() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  
  // Hitung ulang semua riwayat
  riwayatTransaksi.forEach(trx => {
    if(trx.jenis === 'pemasukan') totalPemasukan += trx.nominal;
    if(trx.jenis === 'pengeluaran') totalPengeluaran += trx.nominal;
  });

  const saldoSaatIni = totalPemasukan - totalPengeluaran;
  document.getElementById('saldo').textContent = saldoSaatIni.toLocaleString('id-ID');
}

// ===============================
// MENAMPILKAN RIWAYAT DI HALAMAN
// ===============================
function tampilkanRiwayat() {
  const listPemasukan = document.getElementById('listPemasukan');
  const listPengeluaran = document.getElementById('listPengeluaran');
  
  if(listPemasukan) listPemasukan.innerHTML = "";
  if(listPengeluaran) listPengeluaran.innerHTML = "";

  // Balik urutan agar transaksi paling baru ada di atas
  const riwayatTerbaru = [...riwayatTransaksi].reverse();

  riwayatTerbaru.forEach(trx => {
    const itemHTML = `
      <div class="transaksi">
        <strong>Rp ${trx.nominal.toLocaleString('id-ID')}</strong><br>
        <small>${trx.tanggal} - Pukul ${trx.waktu}</small>
      </div>
    `;
    
    if (trx.jenis === 'pemasukan' && listPemasukan) {
      listPemasukan.innerHTML += itemHTML;
    } else if (trx.jenis === 'pengeluaran' && listPengeluaran) {
      listPengeluaran.innerHTML += itemHTML;
    }
  });
}

// ===============================
// LOGIKA KALENDER GRID
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  // Isi dropdown Tahun otomatis
  const selectTahun = document.getElementById('pilihTahun');
  if (selectTahun) {
    const tahunSekarang = new Date().getFullYear();
    for (let i = tahunSekarang - 5; i <= tahunSekarang + 5; i++) {
      let option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      if (i === tahunSekarang) option.selected = true;
      selectTahun.appendChild(option);
    }
  }
  
  // Set dropdown Bulan ke bulan saat ini
  const selectBulan = document.getElementById('pilihBulan');
  if (selectBulan) {
      selectBulan.value = new Date().getMonth(); 
  }

  updateSaldoTampilan();
  ubahKalender(); // Jalankan kalender pertama kali
});

function ubahKalender() {
  const bulan = parseInt(document.getElementById('pilihBulan').value);
  const tahun = parseInt(document.getElementById('pilihTahun').value);
  const calendarDiv = document.getElementById('calendar');
  
  calendarDiv.innerHTML = ""; 

  // 1. Buat Header Hari (Minggu - Sabtu)
  const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  namaHari.forEach(hari => {
    let divHari = document.createElement('div');
    divHari.textContent = hari;
    divHari.style.background = "transparent";
    divHari.style.color = "#d93670";
    divHari.style.fontWeight = "bold";
    calendarDiv.appendChild(divHari);
  });

  // 2. Cari tahu tanggal 1 jatuh pada hari apa
  const hariPertama = new Date(tahun, bulan, 1).getDay(); 
  const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();

  // 3. Tambahkan kotak kosong agar tanggal 1 pas di bawah nama harinya
  for (let i = 0; i < hariPertama; i++) {
    let divKosong = document.createElement('div');
    divKosong.style.background = "transparent";
    calendarDiv.appendChild(divKosong);
  }

  // 4. Cetak tanggal dari 1 sampai 30/31
  for (let i = 1; i <= jumlahHari; i++) {
    let divTanggal = document.createElement('div');
    divTanggal.textContent = i;
    
    // Fitur Canggih: Beri tanda jika ada transaksi di tanggal ini!
    const tglString = new Date(tahun, bulan, i).toLocaleDateString('id-ID');
    const adaTransaksi = riwayatTransaksi.some(trx => trx.tanggal === tglString);
    
    if (adaTransaksi) {
        divTanggal.style.border = "3px solid #d93670"; // Bingkai pink tebal penanda transaksi
        divTanggal.style.color = "#d93670";
    }

    calendarDiv.appendChild(divTanggal);
  }
}

// ===============================
// FUNGSI NOTIFIKASI
// ===============================
function tampilkanNotifikasi(pesan) {
  const notif = document.getElementById('notifikasiKustom');
  if (notif) {
    notif.innerText = pesan;
    notif.style.display = 'block';
    
    // Hilang otomatis setelah 3 detik
    setTimeout(() => {
      notif.style.display = 'none';
    }, 3000);
  }
}
