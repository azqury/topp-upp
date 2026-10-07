'use client';
import { useEffect, useState } from 'react';
import { useLang } from '../lib/useLang';
import { t } from '../lib/i18n';

const categories = [
  { key: 'all', label: 'Semua' },
  { key: 'game', label: 'Game' },
  { key: 'pulsa', label: 'Pulsa' },
  { key: 'pln', label: 'PLN' },
  { key: 'voucher', label: 'Voucher' }
];

export default function Home() {
  const [lang] = useLang();
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState('all');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);

  async function buy(id) {
    setMsg('');
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id })
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || 'Gagal'); return; }
    setMsg(lang === 'id' ? 'Pembelian berhasil!' : 'Purchase successful!');
    window.location.reload();
  }

  const filtered = active === 'all' ? products : products.filter(p => p.category === active);

  return (
    <div>
      <div className="hero">
        <span className="eyebrow">Top up game & tagihan dalam hitungan detik</span>
        <h1>Isi saldo sekarang, main lagi sekarang juga.</h1>
        <p>Diamond, UC, pulsa, sampai token listrik — masuk otomatis begitu pembayaran kelar, tanpa nunggu admin approve.</p>
        <div className="cta-row">
          <a href="/topup"><button className="primary cta-glow">Isi Saldo Sekarang</button></a>
          <a href="#produk"><button className="btn-ghost">Lihat Produk</button></a>
        </div>
        <div className="trust">
          <div><strong>&lt;1 menit</strong><span>rata-rata proses</span></div>
          <div><strong>24/7</strong><span>nonstop tiap hari</span></div>
          <div><strong>100%</strong><span>otomatis, tanpa admin</span></div>
        </div>
      </div>

      <div id="produk">
        <h2 className="section-label">{t(lang, 'products')}</h2>
        <p className="section-sub">Pilih kategori, langsung beli pakai saldo kamu.</p>

        <div className="tabs">
          {categories.map(c => (
            <button key={c.key} className={`tab ${active === c.key ? 'active' : ''}`} onClick={() => setActive(c.key)}>
              {c.label}
            </button>
          ))}
        </div>

        {msg && <p style={{ marginBottom: 16 }}>{msg}</p>}
        <div className="grid">
          {filtered.map(p => (
            <div className="card" key={p.id}>
              <div className="icon-wrap">{p.image}</div>
              <strong>{p.name}</strong>
              <span className="desc">{p.description}</span>
              <span className="price">Rp{p.price.toLocaleString('id-ID')}</span>
              <button className="primary" onClick={() => buy(p.id)}>{t(lang, 'buy')}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
