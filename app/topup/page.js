'use client';
import { useState } from 'react';
import { useLang } from '../../lib/useLang';
import { t } from '../../lib/i18n';

export default function Topup() {
  const [lang] = useLang();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setMsg(''); setLoading(true);
    const res = await fetch('/api/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, method })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setMsg(lang === 'id'
      ? 'Permintaan top up terkirim, menunggu konfirmasi admin.'
      : 'Top up request submitted, waiting for admin confirmation.');
    setAmount('');
  }

  return (
    <div className="topup-wrap">
      <h1>{t(lang, 'topup')}</h1>
      <p className="sub">Pilih nominal, saldo masuk otomatis setelah dikonfirmasi.</p>
      <div className="topup-card">
        <form onSubmit={submit}>
          <label>{t(lang, 'amount')} (min Rp10.000)</label>
          <input type="number" min="10000" step="1000" placeholder="Contoh: 50000"
            value={amount} onChange={e => setAmount(e.target.value)} required />
          <div className="quick-amounts">
            {[20000, 50000, 100000, 200000].map(v => (
              <button type="button" key={v} onClick={() => setAmount(String(v))}>
                Rp{v.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
          <label>{t(lang, 'method')}</label>
          <select value={method} onChange={e => setMethod(e.target.value)}>
            <option value="bank_transfer">Transfer Bank</option>
            <option value="ewallet">E-Wallet</option>
            <option value="qris">QRIS</option>
          </select>
          {error && <span className="error">{error}</span>}
          {msg && <span className="success-msg">{msg}</span>}
          <button className="primary cta-glow" type="submit" disabled={loading}>
            {loading ? '...' : t(lang, 'submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
