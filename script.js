// ===============================
// DATA TRANSAKSI
// ===============================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let selectedMonth = new Date().getMonth();
let selectedYear = new Date().getFullYear();


// ===============================
// ELEMENT HTML
// ===============================

const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const incomeTotal = document.getElementById("incomeTotal");
const expenseTotal = document.getElementById("expenseTotal");
const balanceTotal = document.getElementById("balanceTotal");

const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");


// ===============================
// MENAMPILKAN BULAN
// ===============================

const months = [
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


// ===============================
// MEMBUAT PILIHAN BULAN
// ===============================

if (monthSelect) {
    months.forEach((month, index) => {
        const option = document.createElement("option");

        option.value = index;
        option.textContent = month;

        monthSelect.appendChild(option);
    });

    monthSelect.value = selectedMonth;

    monthSelect.addEventListener("change", function () {
        selectedMonth = parseInt(this.value);
        updateDisplay();
    });
}


// ===============================
// MEMBUAT PILIHAN TAHUN
// ===============================

if (yearSelect) {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }

    yearSelect.value = selectedYear;

    yearSelect.addEventListener("change", function () {
        selectedYear = parseInt(this.value);
        updateDisplay();
    });
}


// ===============================
// MENAMBAH TRANSAKSI
// ===============================

if (transactionForm) {
    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const date = document.getElementById("date").value;

        if (!description || !amount || !type || !date) {
            alert("Harap isi semua data!");
            return;
        }

        const transaction = {
            id: Date.now(),
            description: description,
            amount: amount,
            type: type,
            date: date
        };

        transactions.push(transaction);

        saveData();

        transactionForm.reset();

        updateDisplay();
    });
}


// ===============================
// MENYIMPAN DATA
// ===============================

function saveData() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// ===============================
// MENAMPILKAN DATA
// ===============================

function updateDisplay() {

    const filteredTransactions = transactions.filter(transaction => {

        const transactionDate = new Date(transaction.date);

        return (
            transactionDate.getMonth() === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
        );

    });


    let income = 0;
    let expense = 0;


    filteredTransactions.forEach(transaction => {

        if (
            // ===============================
// FUNGSI NAVIGASI HALAMAN
// ===============================

// Fungsi untuk menyembunyikan semua halaman
function sembunyikanSemuaHalaman() {
  const semuaHalaman = document.querySelectorAll('.page');
  semuaHalaman.forEach(halaman => {
    halaman.classList.remove('active');
  });
}

// Fungsi membuka halaman menu
function bukaMenu() {
  sembunyikanSemuaHalaman();
  document.getElementById('menu').classList.add('active');
}

// Fungsi kembali ke halaman utama (Home)
function kembaliHome() {
  sembunyikanSemuaHalaman();
  document.getElementById('home').classList.add('active');
}

// Fungsi untuk membuka halaman spesifik (Kalender, Pemasukan, Pengeluaran)
function bukaHalaman(idHalaman) {
  sembunyikanSemuaHalaman();
  document.getElementById(idHalaman).classList.add('active');
}

// ===============================
// FUNGSI KATEGORI (SEMENTARA)
// ===============================

function tambahPemasukan() {
  const nominal = document.getElementById('nominal').value;
  if (!nominal) {
    alert("Harap masukkan nominal terlebih dahulu!");
    return;
  }
  alert("Tombol Pemasukan ditekan! Nominal: Rp " + nominal);
}

function tambahPengeluaran() {
  const nominal = document.getElementById('nominal').value;
  if (!nominal) {
    alert("Harap masukkan nominal terlebih dahulu!");
    return;
  }
  alert("Tombol Pengeluaran ditekan! Nominal: Rp " + nominal);
}

