// =========================
// DATA APLIKASI
// =========================

let saldo = Number(localStorage.getItem("saldo")) || 0;

let pemasukan =
  JSON.parse(localStorage.getItem("pemasukan")) || [];

let pengeluaran =
  JSON.parse(localStorage.getItem("pengeluaran")) || [];


// =========================
// TAMPILKAN SALDO
// =========================

function tampilkanSaldo() {

  document.getElementById("saldo").textContent =
    formatRupiah(saldo);

}


// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(angka) {

  return angka.toLocaleString("id-ID");

}


// =========================
// TAMBAH PEMASUKAN
// =========================

function tambahPemasukan() {

  let nominal =
    Number(document.getElementById("nominal").value);

  if (nominal <= 0) {

    alert("Masukkan nominal terlebih dahulu!");

    return;

  }

  saldo += nominal;

  pemasukan.push({

    nominal: nominal,

    tanggal: new Date().toLocaleDateString("id-ID")

  });

  simpanData();

  tampilkanSaldo();

  document.getElementById("nominal").value = "";

  alert("Pemasukan berhasil ditambahkan!");

}


// =========================
// TAMBAH PENGELUARAN
// =========================

function tambahPengeluaran() {

  let nominal =
    Number(document.getElementById("nominal").value);

  if (nominal <= 0) {

    alert("Masukkan nominal terlebih dahulu!");

    return;

  }

  saldo -= nominal;

  pengeluaran.push({

    nominal: nominal,

    tanggal: new Date().toLocaleDateString("id-ID")

  });

  simpanData();

  tampilkanSaldo();

  document.getElementById("nominal").value = "";

  alert("Pengeluaran berhasil ditambahkan!");

}


// =========================
// SIMPAN DATA
// =========================

function simpanData() {

  localStorage.setItem("saldo", saldo);

  localStorage.setItem(
    "pemasukan",
    JSON.stringify(pemasukan)
  );

  localStorage.setItem(
    "pengeluaran",
    JSON.stringify(pengeluaran)
  );

}


// =========================
// PINDAH HALAMAN
// =========================

function bukaHalaman(namaHalaman) {

  document.querySelectorAll(".page").forEach(function(page) {

    page.classList.remove("active");

  });

  document
    .getElementById(namaHalaman)
    .classList.add("active");


  if (namaHalaman === "kalender") {

    buatKalender();

  }

  if (namaHalaman === "pemasukan") {

    tampilkanPemasukan();

  }

  if (namaHalaman === "pengeluaran") {

    tampilkanPengeluaran();

  }

}


// =========================
// BUKA MENU
// =========================

function bukaMenu() {

  bukaHalaman("menu");

}


// =========================
// KEMBALI KE HOME
// =========================

function kembaliHome() {

  bukaHalaman("home");

}


// =========================
// TAMPILKAN PEMASUKAN
// =========================

function tampilkanPemasukan() {

  let list =
    document.getElementById("listPemasukan");

  list.innerHTML = "";

  if (pemasukan.length === 0) {

    list.innerHTML =
      "<p>Belum ada pemasukan.</p>";

    return;

  }

  pemasukan.forEach(function(data) {

    list.innerHTML += `

      <div class="transaksi">

        + Rp ${formatRupiah(data.nominal)}

        <br>

        <small>${data.tanggal}</small>

      </div>

    `;

  });

}


// =========================
// TAMPILKAN PENGELUARAN
// =========================

function tampilkanPengeluaran() {

  let list =
    document.getElementById("listPengeluaran");

  list.innerHTML = "";

  if (pengeluaran.length === 0) {

    list.innerHTML =
      "<p>Belum ada pengeluaran.</p>";

    return;

  }

  pengeluaran.forEach(function(data) {

    list.innerHTML += `

      <div class="transaksi">

        - Rp ${formatRupiah(data.nominal)}

        <br>

        <small>${data.tanggal}</small>

      </div>

    `;

  });

}


// =========================
// BUAT KALENDER
// =========================

function buatKalender() {

  let sekarang = new Date();

  let tahun =
    sekarang.getFullYear();

  let bulan =
    sekarang.getMonth();

  let namaBulan = [

    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"

  ];

  document.getElementById("tahun")
    .textContent = tahun;

  document.getElementById("bulan")
    .textContent = namaBulan[bulan];


  let kalender =
    document.getElementById("calendar");

  kalender.innerHTML = "";


  let jumlahHari =
    new Date(tahun, bulan + 1, 0)
      .getDate();


  for (let hari = 1; hari <= jumlahHari; hari++) {

    let tanggal =
      document.createElement("div");

    tanggal.textContent = hari;

    kalender.appendChild(tanggal);

  }

}


// =========================
// JALANKAN SAAT PERTAMA DIBUKA
// =========================

tampilkanSaldo();
