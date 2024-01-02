const fs = require('fs');
const prompt = require('prompt-sync')();

class Karyawan {
    constructor(nama, punyaIstri, punyaAnak, jumlahAnak) {
        this.nama = nama;
        this.punyaIstri = punyaIstri;
        this.punyaAnak = punyaAnak;
        this.jumlahAnak = jumlahAnak;
        this.jumlahPengantaran = 0;
        this.jumlahPengantaranBerhasil = 0;
        this.jumlahPaketDikembalikan = 0;
        this.gaji = 4000000; // Gaji pokok
        this.tunjanganIstri = punyaIstri ? 1000000 : 0; // Tunjangan istri
        this.tunjanganAnak = punyaAnak ? jumlahAnak * 500000 : 0; // Tunjangan anak
        this.upahPengantaran = 0; // Upah per pengantaran
        this.bonus = 0; // Bonus pengantaran
        this.potonganGaji = 0; // Potongan gaji
    }

    hitungGaji() {
        this.upahPengantaran = this.jumlahPengantaran * 10000; // Hitung upah pengantaran

        // Hitung bonus
        if (this.jumlahPengantaranBerhasil > 50) {
            this.bonus = 1000000;
        } else if (this.jumlahPengantaranBerhasil > 10) {
            this.bonus = 500000;
        }

        // Hitung potongan gaji
        if (this.jumlahPengantaranBerhasil < 5) {
            this.potonganGaji = 500000;
            this.tunjanganIstri *= 0.5; // Potongan tunjangan istri
            this.tunjanganAnak *= 0.5; // Potongan tunjangan anak
        }

        // Hitung total gaji
        let totalGaji = this.gaji + this.tunjanganIstri + this.tunjanganAnak + this.upahPengantaran + this.bonus - this.potonganGaji;
        return totalGaji;
    }
}

let karyawanList = [];
function tambahKaryawan() {
    const nama = prompt('Nama Karyawan: ');
    const punyaIstri = prompt('Apakah anda sudah punya istri? (sudah/belum): ').toLowerCase() === 'sudah';
    let punyaAnak = false;
    let jumlahAnak = 0;

    if (punyaIstri) {
        punyaAnak = prompt('Apakah anda sudah punya anak? (sudah/belum): ').toLowerCase() === 'sudah';
        if (punyaAnak) {
            jumlahAnak = parseInt(prompt('Jumlah Anak: '));
        }
    }

    const karyawanBaru = new Karyawan(nama, punyaIstri, punyaAnak, jumlahAnak);
    karyawanList.push(karyawanBaru);
    console.log('Karyawan berhasil ditambahkan!');
}

function cariKaryawan() {
    const namaCari = prompt('Masukkan nama karyawan: ');
    const karyawan = karyawanList.find(k => k.nama === namaCari);
    if (karyawan) {
        let keterangan = 'Karyawan ditemukan!\nNama Karyawan: ' + karyawan.nama + '\nKeterangan: ';
        keterangan += (karyawan.punyaIstri ? 'Sudah Menikah ' : 'Belum Menikah ') + 'dan memiliki ' + karyawan.jumlahAnak + ' anak';
        console.log(keterangan);
    } else {
        console.log('Karyawan tidak ditemukan.');
    }
}

function hapusKaryawan() {
    console.log('Daftar Karyawan:');
    karyawanList.forEach((k, index) => console.log((index + 1) + '. ' + k.nama));

    const indexHapus = parseInt(prompt('Pilih Karyawan yang akan dihapus [1-' + karyawanList.length + ']: ')) - 1;
    if (indexHapus >= 0 && indexHapus < karyawanList.length) {
        karyawanList.splice(indexHapus, 1);
        console.log('Karyawan berhasil dihapus!');
    } else {
        console.log('Pilihan tidak valid.');
    }
}

function tambahPengantaran() {
    console.log('Daftar Karyawan:');
    karyawanList.forEach((k, index) => console.log((index + 1) + '. ' + k.nama));

    const indexKaryawan = parseInt(prompt('Pilih Karyawan yang akan melakukan pengantaran [1-' + karyawanList.length + ']: ')) - 1;
    if (indexKaryawan >= 0 && indexKaryawan < karyawanList.length) {
        const jenisPaket = prompt('Masukan jenis paket yang akan anda antar: ');
        const infoPaket = prompt('Apakah paket sudah diterima oleh yang bersangkutan? (sudah/belum): ').toLowerCase() === 'sudah';

        if (!infoPaket) {
            console.log('Paket akan dikembalikan.');
            karyawanList[indexKaryawan].jumlahPengantaran++;
            karyawanList[indexKaryawan].jumlahPaketDikembalikan = karyawanList[indexKaryawan].jumlahPaketDikembalikan ? karyawanList[indexKaryawan].jumlahPaketDikembalikan + 1 : 1;
        } else {
            karyawanList[indexKaryawan].jumlahPengantaran++;
            karyawanList[indexKaryawan].jumlahPengantaranBerhasil++;
            console.log('Paket telah diterima oleh yang bersangkutan!');
        }    
    }
}

function cariPengantaran() {
    console.log('Daftar Karyawan:');
    karyawanList.forEach((k, index) => console.log((index + 1) + '. ' + k.nama));

    const indexKaryawan = parseInt(prompt('Pilih Karyawan yang akan dicari pengantarannya [1-' + karyawanList.length + ']: ')) - 1;
    if (indexKaryawan >= 0 && indexKaryawan < karyawanList.length) {
        const karyawan = karyawanList[indexKaryawan];
        console.log('Pengantaran ditemukan!\nNama Karyawan: ' + karyawan.nama + '\nJumlah Pengantaran: ' + karyawan.jumlahPengantaran + '\nJumlah Pengantaran Berhasil: ' + karyawan.jumlahPengantaranBerhasil + '\njumlahPaketDikembalikan: ' + karyawan.jumlahPaketDikembalikan);
    } else {
        console.log('Pilihan tidak valid.');
    }
}

function hapusPengantaran() {
    console.log('Daftar Karyawan:');
    karyawanList.forEach((k, index) => console.log((index + 1) + '. ' + k.nama));

    const indexKaryawan = parseInt(prompt('Pilih Karyawan yang akan dihapus pengantarannya [1-' + karyawanList.length + ']: ')) - 1;
    if (indexKaryawan >= 0 && indexKaryawan < karyawanList.length) {
        karyawanList[indexKaryawan].jumlahPengantaran = 0;
        karyawanList[indexKaryawan].jumlahPengantaranBerhasil = 0;
        console.log('Pengantaran berhasil dihapus!');
    } else {
        console.log('Pilihan tidak valid.');
    }
}

function hitungGaji() {
    console.log('Daftar Karyawan:');
    karyawanList.forEach((k, index) => console.log((index + 1) + '. ' + k.nama));

    const indexKaryawan = parseInt(prompt('Pilih Karyawan yang akan dihitung gajinya [1-' + karyawanList.length + ']: ')) - 1;
    if (indexKaryawan >= 0 && indexKaryawan < karyawanList.length) {
        const gajiKaryawan = karyawanList[indexKaryawan].hitungGaji();
        console.log(`Gaji ${karyawanList[indexKaryawan].nama} adalah Rp ${gajiKaryawan}`);
    } else {
        console.log('Pilihan tidak valid.');
    }
}

function simpanData() {
    const dataToSave = karyawanList.map(({ JumlahPaketDikembalikan, ...rest }) => ({ JumlahPaketDikembalikan, ...rest }));
    const dataJSON = JSON.stringify(dataToSave, null, 2);
    fs.writeFileSync('data-karyawan.json', dataJSON);
    console.log('Data Karyawan berhasil disimpan');
}

function hapusFileJson() {
    fs.unlinkSync('data-karyawan.json');
    console.log('Terima kasih Sampai Jumpa Lagi!');
}

function keluarProgram() {
    let hitunganMundur = 5; // Waktu hitungan mundur
    console.log(`Program akan menutup dalam ${hitunganMundur} detik.`);
    const hitungMundur = setInterval(() => {
        hitunganMundur--;
        console.log(`Program akan menutup dalam ${hitunganMundur} detik.`);
        if (hitunganMundur === 0) {
            clearInterval(hitungMundur);
            hapusFileJson();
        }
    }, 1000); // Interval dalam milidetik (1000 milidetik = 1 detik)
}

let menu;
do {
    console.log(`
    Program Penggajian Karyawan
    ==========================
    1. Tambah Karyawan
    2. Cari Karyawan
    3. Hapus Karyawan
    4. Tambah Pengantaran
    5. Cari Pengantaran
    6. Hapus Pengantaran
    7. Hitung Gaji
    8. Simpan Data
    9. Keluar
    `);

    const jawabanMenu = parseInt(prompt('Pilih Menu [1-9]: '));
    menu = jawabanMenu;

    switch (menu) {
        case 1:
            tambahKaryawan();
            break;
        case 2:
            cariKaryawan();
            break;
        case 3:
            hapusKaryawan();
            break;
        case 4:
            tambahPengantaran();
            break;
        case 5:
            cariPengantaran();
            break;
        case 6:
            hapusPengantaran();
            break;
        case 7:
            hitungGaji();
            break;
        case 8:
            simpanData();
            break;
        case 9:
            keluarProgram();
            break;
        default:
            console.log('Pilihan tidak valid. Kembali ke menu.');
    }
} while (menu !== 9);