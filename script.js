// ===============================
// 1. DATA TRANSAKSI (BUKU BESAR)
// ===============================
// Mengambil data tersimpan dari browser atau buat array kosong jika belum ada
let riwayatTransaksi = JSON.parse(localStorage.getItem('riwayatUang')) || [];

// ===============================
// 2. NAVIGASI HALAMAN
// ===============================
function bukaHalaman(idHalaman) {
  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Tampilkan halaman yang dituju
  const halamanTujuan = document.getElementById(idHalaman);
  if (halamanTujuan) {
    halamanTujuan.classList.add('active');
  }
  
  // Jika membuka halaman Pemasukan/Pengeluaran, otomatis tampilkan daftarnya
  if (idHalaman === 'pemasukan' || idHalaman === 'pengeluaran') {
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
// 3. LOGIKA TRANSAKSI (INPUT & SIMPAN)
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

  // Catat transaksi dengan tanggal dan jam saat ini
  const tanggalSekarang = new Date();
  const catatanBaru = {
    id: Date.now(),
    jenis: jenis,
    nominal: nominal,
    tanggal: tanggalSekarang.toLocaleDateString('id-ID'), // Format: DD/MM/YYYY
    waktu: tanggalSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  // Simpan ke array dan memori browser (localStorage)
  riwayatTransaksi.push(catatanBaru);
  localStorage.setItem('riwayatUang', JSON.stringify(riwayatTransaksi));

  // Update saldo di layar utama
  updateSaldoTampilan();
  
  // Kosongkan kolom input nominal
  nominalInput.value = ""; 
  
  // Tampilkan notifikasi kustom centang hijau
  tampilkanNotifikasi("Berhasil ditambahkan ✅");
}

function updateSaldoTampilan() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  
  riwayatTransaksi.forEach(trx => {
    if (trx.jenis === 'pemasukan') totalPemasukan += trx.nominal;
    if (trx.jenis === 'pengeluaran') totalPengeluaran += trx.nominal;
  });

  const saldoSaatIni = totalPemasukan - totalPengeluaran;
  const saldoElement = document.getElementById('saldo');
  if (saldoElement) {
    saldoElement.textContent = saldoSaatIni.toLocaleString('id-ID');
  }
}

// ===============================
// 4. MENAMPILKAN RIWAYAT TRANSAKSI
// ===============================
function tampilkanRiwayat() {
  const listPemasukan = document.getElementById('listPemasukan');
  const listPengeluaran = document.getElementById('listPengeluaran');
  
  if (listPemasukan) listPemasukan.innerHTML = "";
  if (listPengeluaran) listPengeluaran.innerHTML = "";

  // Urutkan agar transaksi terbaru muncul paling atas
  const riwayatTerbaru = [...riwayatTransaksi].reverse();

  riwayatTerbaru.forEach(trx => {
    const itemHTML = `
      <div class="transaksi" style="background: white; padding: 12px 15px; margin-bottom: 10px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <strong style="font-size: 16px; color: ${trx.jenis === 'pemasukan' ? '#42b883' : '#e85d75'};">
          ${trx.jenis === 'pemasukan' ? '+' : '-'} Rp ${trx.nominal.toLocaleString('id-ID')}
        </strong><br>
        <small style="color: #888;">${trx.tanggal} - Pukul ${trx.waktu}</small>
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
// 5. KALENDER GRID & RINGKASAN ANGKA
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  // Isi dropdown tahun secara otomatis
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
  
  // Set bulan saat ini pada dropdown
  const selectBulan = document.getElementById('pilihBulan');
  if (selectBulan) {
    selectBulan.value = new Date().getMonth(); 
  }

  updateSaldoTampilan();
  ubahKalender();
});

function ubahKalender() {
  const bulanSelect = document.getElementById('pilihBulan');
  const tahunSelect = document.getElementById('pilihTahun');
  const calendarDiv = document.getElementById('calendar');
  
  if (!bulanSelect || !tahunSelect || !calendarDiv) return;

  const bulan = parseInt(bulanSelect.value);
  const tahun = parseInt(tahunSelect.value);
  
  calendarDiv.innerHTML = ""; 

  // Header Hari (Min - Sab)
  const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  namaHari.forEach(hari => {
    let divHari = document.createElement('div');
    divHari.textContent = hari;
    divHari.style.background = "transparent";
    divHari.style.color = "#d93670";
    divHari.style.fontWeight = "bold";
    calendarDiv.appendChild(divHari);
  });

  const hariPertama = new Date(tahun, bulan, 1).getDay(); 
  const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();

  // Kotak kosong penyeimbang hari pertama
  for (let i = 0; i < hariPertama; i++) {
    let divKosong = document.createElement('div');
    divKosong.style.background = "transparent";
    calendarDiv.appendChild(divKosong);
  }

  // Cetak tanggal beserta rekap nominal transaksi
  for (let i = 1; i <= jumlahHari; i++) {
    let divTanggal = document.createElement('div');
    divTanggal.style.display = "flex";
    divTanggal.style.flexDirection = "column";
    divTanggal.style.alignItems = "center";
    divTanggal.style.justifyContent = "center";
    divTanggal.style.padding = "4px 0";

    let teksTanggal = `<span style="font-size: 15px; font-weight: bold; color: #54263a;">${i}</span>`;
    
    // Cari transaksi pada tanggal ini
    const tglString = new Date(tahun, bulan, i).toLocaleDateString('id-ID');
    const transaksiHariIni = riwayatTransaksi.filter(trx => trx.tanggal === tglString);
    
    if (transaksiHariIni.length > 0) {
      divTanggal.style.border = "2px solid #d93670";
      
      let totalMasuk = 0;
      let totalKeluar = 0;
      
      transaksiHariIni.forEach(trx => {
        if (trx.jenis === 'pemasukan') totalMasuk += trx.nominal;
        if (trx.jenis === 'pengeluaran') totalKeluar += trx.nominal;
      });

      // Format angka ringkas (+30k, -15k, dll)
      function ringkasAngka(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
        return num;
      }

      let teksNominal = "";
      
      if (totalMasuk > 0) {
        teksNominal += `<span style="color: #42b883; font-size: 10px; font-weight: bold; margin-top: 2px;">+${ringkasAngka(totalMasuk)}</span>`;
      }
      if (totalKeluar > 0) {
        teksNominal += `<span style="color: #e85d75; font-size: 10px; font-weight: bold; margin-top: 1px;">-${ringkasAngka(totalKeluar)}</span>`;
      }

      divTanggal.innerHTML = teksTanggal + teksNominal;
    } else {
      divTanggal.innerHTML = teksTanggal;
    }

    calendarDiv.appendChild(divTanggal);
  }
}

// ===============================
// 6. NOTIFIKASI KUSTOM TOAST
// ===============================
function tampilkanNotifikasi(pesan) {
  const notif = document.getElementById('notifikasiKustom');
  if (notif) {
    notif.innerText = pesan;
    notif.style.display = 'block';
    
    setTimeout(() => {
      notif.style.display = 'none';
    }, 3000);
  }
}
