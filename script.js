// ===============================
// NAVIGASI HALAMAN
// ===============================

// Fungsi untuk berpindah halaman
function bukaHalaman(idHalaman) {
  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  // Tampilkan halaman yang dituju
  document.getElementById(idHalaman).classList.add('active');
}

function bukaMenu() {
  bukaHalaman('menu');
}

function kembaliHome() {
  bukaHalaman('home');
}

// ===============================
// LOGIKA KALENDER
// ===============================

// Mengisi pilihan tahun otomatis saat halaman dimuat
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
  // Inisialisasi kalender
  ubahKalender();
});

function ubahKalender() {
  const bulan = document.getElementById('pilihBulan').value;
  const tahun = document.getElementById('pilihTahun').value;
  const calendarDiv = document.getElementById('calendar');
  
  calendarDiv.innerHTML = ""; // Bersihkan isi lama

  // Contoh logika sederhana: membuat kotak 30 hari
  for (let i = 1; i <= 30; i++) {
    let div = document.createElement('div');
    div.textContent = i;
    calendarDiv.appendChild(div);
  }
  console.log(`Kalender diperbarui ke: ${bulan}-${tahun}`);
}

// ===============================
// LOGIKA TRANSAKSI (INPUT)
// ===============================

function tambahPemasukan() {
  const nominal = document.getElementById('nominal').value;
  if (!nominal || nominal <= 0) {
    alert("Masukkan nominal yang valid!");
    return;
  }
  
  // Update saldo di tampilan
  const saldoEl = document.getElementById('saldo');
  let saldo = parseInt(saldoEl.textContent.replace(/\./g, '')) || 0;
  saldo += parseInt(nominal);
  saldoEl.textContent = saldo.toLocaleString('id-ID');
  
  document.getElementById('nominal').value = ""; // Reset input
  alert("Pemasukan sebesar Rp " + nominal + " berhasil ditambahkan!");
}

function tambahPengeluaran() {
  const nominal = document.getElementById('nominal').value;
  if (!nominal || nominal <= 0) {
    alert("Masukkan nominal yang valid!");
    return;
  }

  // Update saldo di tampilan
  const saldoEl = document.getElementById('saldo');
  let saldo = parseInt(saldoEl.textContent.replace(/\./g, '')) || 0;
  saldo -= parseInt(nominal);
  saldoEl.textContent = saldo.toLocaleString('id-ID');

  document.getElementById('nominal').value = ""; // Reset input
  alert("Pengeluaran sebesar Rp " + nominal + " berhasil dicatat!");
}
