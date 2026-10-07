'use client';
import { useState } from 'react';
import { useLang } from '../../lib/useLang';
import { t } from '../../lib/i18n';

export default function Login() {
  const [lang] = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    window.location.href = '/';
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>{t(lang, 'login')}</h1>
        <p className="sub">Masuk buat lanjut top up & belanja.</p>
        <form onSubmit={submit}>
          <input type="email" placeholder={t(lang, 'email')} value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder={t(lang, 'password')} value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <span className="error">{error}</span>}
          <button className="primary" type="submit" disabled={loading}>{loading ? '...' : t(lang, 'submit')}</button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>
            {lang === 'id' ? '⚡ Akun Uji Coba (Testing Lokal):' : '⚡ Demo Accounts (Local Testing):'}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: 12, padding: '7px 12px' }}
              onClick={() => { setEmail('user@topup.local'); setPassword('user123'); }}
            >
              👤 Akun User (Bukan Admin)
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: 12, padding: '7px 12px' }}
              onClick={() => { setEmail('admin@topup.local'); setPassword('admin123'); }}
            >
              👑 Akun Admin
            </button>
          </div>
        </div>

        <p className="switch">{t(lang, 'no_account')} <a href="/register">{t(lang, 'register')}</a></p>
      </div>
    </div>
  );
}
