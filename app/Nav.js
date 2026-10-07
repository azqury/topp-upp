'use client';
import { useEffect, useState } from 'react';
import { useLang } from '../lib/useLang';
import { t } from '../lib/i18n';

export default function Nav() {
  const [lang, setLang] = useLang();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setUser);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className="nav">
      <a href="/" className="brand"><span className="mark" />{t(lang, 'title')}</a>
      <div className="links">
        <a href="/">{t(lang, 'home')}</a>
        {user && <a href="/topup">{t(lang, 'topup')}</a>}
        {user && <a href="/dashboard">{t(lang, 'dashboard')}</a>}
        {user && user.role === 'ADMIN' && <a href="/admin">{t(lang, 'admin')}</a>}
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="id">ID</option>
          <option value="en">EN</option>
        </select>
        {user ? (
          <>
            <span className="badge">{t(lang, 'balance')}: Rp{user.balance?.toLocaleString('id-ID')}</span>
            <button onClick={logout}>{t(lang, 'logout')}</button>
          </>
        ) : (
          <>
            <a href="/login">{t(lang, 'login')}</a>
            <a href="/register">{t(lang, 'register')}</a>
          </>
        )}
      </div>
    </div>
  );
}