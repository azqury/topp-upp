const dict = {
  id: {
    title: 'TopUp Store',
    home: 'Beranda',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
    balance: 'Saldo',
    topup: 'Top Up',
    dashboard: 'Riwayat',
    admin: 'Admin',
    buy: 'Beli',
    name: 'Nama',
    email: 'Email',
    password: 'Kata Sandi',
    amount: 'Jumlah',
    method: 'Metode Pembayaran',
    submit: 'Kirim',
    products: 'Produk',
    welcome: 'Selamat datang',
    pending: 'Menunggu',
    success: 'Berhasil',
    failed: 'Gagal',
    approve: 'Setujui',
    reject: 'Tolak',
    no_account: 'Belum punya akun?',
    have_account: 'Sudah punya akun?'
  },
  en: {
    title: 'TopUp Store',
    home: 'Home',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    balance: 'Balance',
    topup: 'Top Up',
    dashboard: 'History',
    admin: 'Admin',
    buy: 'Buy',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    amount: 'Amount',
    method: 'Payment Method',
    submit: 'Submit',
    products: 'Products',
    welcome: 'Welcome',
    pending: 'Pending',
    success: 'Success',
    failed: 'Failed',
    approve: 'Approve',
    reject: 'Reject',
    no_account: "Don't have an account?",
    have_account: 'Already have an account?'
  }
};

export function t(lang, key) {
  return (dict[lang] && dict[lang][key]) || dict.id[key] || key;
}

export { dict };