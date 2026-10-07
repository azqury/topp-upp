'use client';
import { useEffect, useState } from 'react';
import { useLang } from '../../lib/useLang';
import { t } from '../../lib/i18n';

export default function Admin() {
  const [lang] = useLang();
  const [trx, setTrx] = useState([]);
  const [error, setError] = useState('');

  function load() {
    fetch('/api/admin/transactions').then(async r => {
      if (!r.ok) { setError((await r.json()).error); return; }
      setTrx(await r.json());
    });
  }

  useEffect(load, []);

  async function act(id, status) {
    await fetch(`/api/admin/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    load();
  }

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>{t(lang, 'admin')} - {t(lang, 'topup')}</h1>
      <table>
        <thead>
          <tr><th>ID</th><th>User</th><th>{t(lang, 'amount')}</th><th>{t(lang, 'method')}</th><th>Status</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {trx.map(tr => (
            <tr key={tr.id}>
              <td>{tr.id}</td>
              <td>{tr.user?.name} ({tr.user?.email})</td>
              <td>Rp{tr.amount.toLocaleString('id-ID')}</td>
              <td>{tr.method}</td>
              <td className={`status-${tr.status}`}>{t(lang, tr.status.toLowerCase())}</td>
              <td>
                {tr.status === 'PENDING' && (
                  <>
                    <button className="primary" onClick={() => act(tr.id, 'SUCCESS')}>{t(lang, 'approve')}</button>{' '}
                    <button onClick={() => act(tr.id, 'FAILED')}>{t(lang, 'reject')}</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
