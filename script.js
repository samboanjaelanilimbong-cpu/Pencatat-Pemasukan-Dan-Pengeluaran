// =========================
// DATA
// =========================

let saldo =
  Number(localStorage.getItem("saldo")) || 0;


let pemasukan =
  JSON.parse(
    localStorage.getItem("pemasukan")
  ) || [];


let pengeluaran =
  JSON.parse(
    localStorage.getItem("pengeluaran")
  ) || [];


// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(angka) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(angka);

}


// =========================
// TAMPILKAN SALDO
// =========================

function tampilkanSaldo() {

  document.getElementById("saldo")
    .textContent =
    formatRupiah(saldo);

}


// =========================
// TAMBAH PEMASUKAN
// =========================

function tambahPemasukan() {

  const input =
    document.getElementById("nominal");


  const nominal =
    Number(input.value);


  if (!nominal || nominal <= 0) {

    alert(
      "Masukkan nominal yang benar!"
    );

    return;

  }


  saldo += nominal;


  pemasukan.push({

    nominal: nominal,

    tanggal:
      new Date()
      .toLocaleString("id-ID")

  });


  simpanData();

  tampilkanSaldo();

  input.value = "";


  alert(
    "Pemasukan berhasil ditambahkan!"
  );

}


// =========================
// TAMBAH PENGELUARAN
// =========================

function tambahPengeluaran() {

  const input =
    document.getElementById("nominal");


  const nominal =
    Number(input.value);


  if (!nominal || nominal <= 0) {

    alert(
      "Masukkan nominal yang benar!"
    );

    return;

  }


  saldo -= nominal;


  pengeluaran.push({

    nominal: nominal,

    tanggal:
      new Date()
      .toLocaleString("id-ID")

  });


  simpanData();

  tampilkanSaldo();

  input.value = "";


  alert(
    "Pengeluaran berhasil ditambahkan!"
  );

}


// =========================
// SIMPAN DATA
// =========================

function simpanData() {

  localStorage.setItem(
    "saldo",
    saldo
  );


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


  document
    .querySelectorAll(".page")
    .forEach(

      function(page) {

        page.classList
          .remove("active");

      }

    );


  const halaman =
    document.getElementById(
      namaHalaman
    );


  if (halaman) {

    halaman.classList
      .add("active");

  }


  if (
    namaHalaman ===
    "pemasukan"
  ) {

    tampilkanPemasukan();

  }


  if (
    namaHalaman ===
    "pengeluaran"
  ) {

    tampilkanPengeluaran();

  }


  if (
    namaHalaman ===
    "kalender"
  ) {

    buatKalender();

  }

}


// =========================
// MENU
// =========================

function bukaMenu() {

  bukaHalaman("menu");

}


function kembaliHome() {

  bukaHalaman("home");

}


// =========================
// PEMASUKAN
// =========================

function tampilkanPemasukan() {


  const list =
    document.getElementById(
      "listPemasukan"
    );


  list.innerHTML = "";


  if (
    pemasukan.length === 0
  ) {

    list.innerHTML =
      "<p>Belum ada pemasukan.</p>";

    return;

  }


  pemasukan
    .slice()
    .reverse()
    .forEach(

      function(data) {


        list.innerHTML += `

          <div class="transaksi">

            + ${formatRupiah(
              data.nominal
            )}

            <small>
              ${data.tanggal}
            </small>

          </div>

        `;

      }

    );

}


// =========================
// PENGELUARAN
// =========================

function tampilkanPengeluaran() {


  const list =
    document.getElementById(
      "listPengeluaran"
    );


  list.innerHTML = "";


  if (
    pengeluaran.length === 0
  ) {

    list.innerHTML =
      "<p>Belum ada pengeluaran.</p>";

    return;

  }


  pengeluaran
    .slice()
    .reverse()
    .forEach(

      function(data) {


        list.innerHTML += `

          <div class="transaksi">

            - ${formatRupiah(
              data.nominal
            )}

            <small>
              ${data.tanggal}
            </small>

          </div>

        `;

      }

    );

}


// =========================
// KALENDER
// =========================

function buatKalender() {


  const sekarang =
    new Date();


  const tahun =
    sekarang.getFullYear();


  const bulan =
    sekarang.getMonth();


  const namaBulan = [

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


  document
    .getElementById("tahun")
    .textContent =
    tahun;


  document
    .getElementById("bulan")
    .textContent =
    namaBulan[bulan];


  const kalender =
    document.getElementById(
      "calendar"
    );


  kalender.innerHTML = "";


  const jumlahHari =
    new Date(
      tahun,
      bulan + 1,
      0
    ).getDate();


  for (

    let hari = 1;

    hari <= jumlahHari;

    hari++

  ) {


    const tanggal =
      document.createElement(
        "div"
      );


    tanggal.textContent =
      hari;


    kalender.appendChild(
      tanggal
    );

  }

}


// =========================
// MULAI APLIKASI
// =========================

tampilkanSaldo();
