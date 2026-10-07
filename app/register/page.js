'use client';
import { useState } from 'react';
import { useLang } from '../../lib/useLang';
import { t } from '../../lib/i18n';

export default function Register() {
  const [lang] = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    window.location.href = '/';
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>{t(lang, 'register')}</h1>
        <p className="sub">Bikin akun buat mulai top up.</p>
        <form onSubmit={submit}>
          <input placeholder={t(lang, 'name')} value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder={t(lang, 'email')} value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder={t(lang, 'password')} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          {error && <span className="error">{error}</span>}
          <button className="primary" type="submit" disabled={loading}>{loading ? '...' : t(lang, 'submit')}</button>
        </form>
        <p className="switch">{t(lang, 'have_account')} <a href="/login">{t(lang, 'login')}</a></p>
      </div>
    </div>
  );
}
