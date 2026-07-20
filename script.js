// ===============================
// 1. DATA TRANSAKSI (BUKU BESAR)
// ===============================
let riwayatTransaksi = JSON.parse(localStorage.getItem('riwayatUang')) || [];

// ===============================
// 2. NAVIGASI HALAMAN
// ===============================
function bukaHalaman(idHalaman) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  const halamanTujuan = document.getElementById(idHalaman);
  if (halamanTujuan) {
    halamanTujuan.classList.add('active');
  }
  
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

  const tanggalSekarang = new Date();
  const catatanBaru = {
    id: Date.now(),
    jenis: jenis,
    nominal: nominal,
    tanggal: tanggalSekarang.toLocaleDateString('id-ID'), // Format: DD/MM/YYYY
    waktu: tanggalSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  riwayatTransaksi.push(catatanBaru);
  localStorage.setItem('riwayatUang', JSON.stringify(riwayatTransaksi));

  updateSaldoTampilan();
  nominalInput.value = ""; 
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
// 4. MENAMPILKAN & MENGHAPUS RIWAYAT
// ===============================
function tampilkanRiwayat() {
  const listPemasukan = document.getElementById('listPemasukan');
  const listPengeluaran = document.getElementById('listPengeluaran');
  
  if (listPemasukan) listPemasukan.innerHTML = "";
  if (listPengeluaran) listPengeluaran.innerHTML = "";

  const riwayatTerbaru = [...riwayatTransaksi].reverse();

  riwayatTerbaru.forEach(trx => {
    const itemHTML = `
      <div class="transaksi-item" style="background: white; padding: 15px; margin-bottom: 12px; border-radius: 18px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(180, 60, 100, 0.08);">
        <div>
          <strong style="font-size: 17px; color: ${trx.jenis === 'pemasukan' ? '#42b883' : '#e85d75'}; display: block; margin-bottom: 3px;">
            ${trx.jenis === 'pemasukan' ? '+' : '-'} Rp ${trx.nominal.toLocaleString('id-ID')}
          </strong>
          <small style="color: #888; font-size: 12px;">${trx.tanggal} - Pukul ${trx.waktu}</small>
        </div>
        <button onclick="hapusTransaksi(${trx.id})" style="background: #ffe1eb; color: #e85d75; border: none; border-radius: 12px; padding: 8px 12px; cursor: pointer; font-size: 15px;" title="Hapus transaksi">
          🗑️
        </button>
      </div>
    `;
    
    if (trx.jenis === 'pemasukan' && listPemasukan) {
      listPemasukan.innerHTML += itemHTML;
    } else if (trx.jenis === 'pengeluaran' && listPengeluaran) {
      listPengeluaran.innerHTML += itemHTML;
    }
  });
}

function hapusTransaksi(id) {
  riwayatTransaksi = riwayatTransaksi.filter(trx => trx.id !== id);
  localStorage.setItem('riwayatUang', JSON.stringify(riwayatTransaksi));
  
  updateSaldoTampilan();
  tampilkanRiwayat();
  ubahKalender();
  
  tampilkanNotifikasi("Transaksi dihapus 🗑️");
}

// ===============================
// 5. KALENDER GRID & SALDO AKHIR HARIAN
// ===============================
document.addEventListener('DOMContentLoaded', () => {
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

  for (let i = 0; i < hariPertama; i++) {
    let divKosong = document.createElement('div');
    divKosong.style.background = "transparent";
    calendarDiv.appendChild(divKosong);
  }

  for (let i = 1; i <= jumlahHari; i++) {
    let divTanggal = document.createElement('div');
    divTanggal.style.display = "flex";
    divTanggal.style.flexDirection = "column";
    divTanggal.style.alignItems = "center";
    divTanggal.style.justifyContent = "center";
    divTanggal.style.padding = "4px 0";

    let teksTanggal = `<span style="font-size: 15px; font-weight: bold; color: #54263a;">${i}</span>`;
    
    const tglString = new Date(tahun, bulan, i).toLocaleDateString('id-ID');
    const transaksiHariIni = riwayatTransaksi.filter(trx => trx.tanggal === tglString);
    
    if (transaksiHariIni.length > 0) {
      divTanggal.style.border = "2px solid #d93670";
      divTanggal.style.cursor = "pointer";
      
      let totalMasuk = 0;
      let totalKeluar = 0;
      
      transaksiHariIni.forEach(trx => {
        if (trx.jenis === 'pemasukan') totalMasuk += trx.nominal;
        if (trx.jenis === 'pengeluaran') totalKeluar += trx.nominal;
      });

      // Hitung Saldo Akhir Harian
      const saldoHarian = totalMasuk - totalKeluar;

      function ringkasAngka(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
        return num;
      }

      let warnaSaldo = saldoHarian >= 0 ? '#42b883' : '#e85d75';
      let tandaSaldo = saldoHarian > 0 ? '+' : (saldoHarian < 0 ? '-' : '');
      let teksSaldo = `<span style="color: ${warnaSaldo}; font-size: 10px; font-weight: bold; margin-top: 2px;">${tandaSaldo}${ringkasAngka(Math.abs(saldoHarian))}</span>`;

      divTanggal.innerHTML = teksTanggal + teksSaldo;
      
      // Event saat tanggal ditekan
      divTanggal.onclick = () => bukaDetailHari(tglString);
    } else {
      divTanggal.innerHTML = teksTanggal;
    }

    calendarDiv.appendChild(divTanggal);
  }
}

// ===============================
// 6. POPUP DETAIL TRANSAKSI HARIAN
// ===============================
function bukaDetailHari(tanggal) {
  const transaksiHariIni = riwayatTransaksi.filter(trx => trx.tanggal === tanggal);
  if (transaksiHariIni.length === 0) return;

  let modal = document.getElementById('modalDetailHari');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalDetailHari';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 10000; padding: 20px;
    `;
    document.body.appendChild(modal);
  }

  let itemHTML = '';
  [...transaksiHariIni].reverse().forEach(trx => {
    itemHTML += `
      <div style="background: #fff0f5; padding: 12px 15px; margin-bottom: 10px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: ${trx.jenis === 'pemasukan' ? '#42b883' : '#e85d75'}; font-size: 16px;">
            ${trx.jenis === 'pemasukan' ? '+' : '-'} Rp ${trx.nominal.toLocaleString('id-ID')}
          </strong><br>
          <small style="color: #777; font-size: 11px;">Pukul ${trx.waktu} (${trx.jenis})</small>
        </div>
        <button onclick="hapusDariModal(${trx.id}, '${tanggal}')" style="background: #ffe1eb; color: #e85d75; border: none; border-radius: 10px; padding: 6px 10px; cursor: pointer; font-size: 14px;">
          🗑️
        </button>
      </div>
    `;
  });

  modal.innerHTML = `
    <div style="background: white; border-radius: 24px; padding: 22px; width: 100%; max-width: 340px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #d93670; font-size: 18px;">Transaksi ${tanggal}</h3>
        <button onclick="tutupDetailHari()" style="background: #ffe1eb; border: none; border-radius: 50%; width: 30px; height: 30px; font-weight: bold; color: #d93670; cursor: pointer;">✕</button>
      </div>
      <div>${itemHTML}</div>
    </div>
  `;
  modal.style.display = 'flex';
}

function tutupDetailHari() {
  const modal = document.getElementById('modalDetailHari');
  if (modal) modal.style.display = 'none';
}

function hapusDariModal(id, tanggal) {
  hapusTransaksi(id);
  const sisaTransaksi = riwayatTransaksi.filter(trx => trx.tanggal === tanggal);
  if (sisaTransaksi.length > 0) {
    bukaDetailHari(tanggal);
  } else {
    tutupDetailHari();
  }
}

// ===============================
// 7. NOTIFIKASI KUSTOM TOAST
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
